import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


# how long (seconds) samples should be considered for
SAMPLE_WINDOW = 200

# print(os.getcwd() + '\Manuscript Excel Figures.xlsx')
excel_path = os.getcwd() + '\Manuscript Excel Figures.xlsx'

excel_sheet = pd.ExcelFile(excel_path)
df_pressure = pd.read_excel(excel_sheet, 'capstone_sample')
# have to drop unnamed columns that come from the manuscript excel file having weird formatting
df_pressure = df_pressure[df_pressure.columns.drop(list(df_pressure.filter(regex='Unnamed:')))]
samples_needed = round((1/df_pressure['cycle_time'].diff().mean()) * SAMPLE_WINDOW)
# df_pressure['Diff'] = df_pressure.cycle_time - pd.Series(df_pressure.cycle_time, df_pressure.index)
# print(df_pressure.Diff)
df_pressure['scaled_cycle_ip'] = df_pressure['cycle_ip'] - df_pressure['cycle_ip'].min()

# making the load column a sliding sum (not weighted)
# df_pressure['load_sum'] = df_pressure['scaled_cycle_ip'].rolling(min_periods=1, window=samples_needed).sum()


# https://stackoverflow.com/questions/9621362/how-do-i-compute-a-weighted-moving-average-using-pandas
def wma(arr, period):
    kernel = np.arange(period, 0, -1)
    kernel = np.concatenate([np.zeros(period - 1), kernel / kernel.sum()])
    return np.convolve(arr, kernel, 'same')


df_pressure['load_wma'] = df_pressure['scaled_cycle_ip'].rolling(min_periods=1, window=samples_needed).sum()
df_pressure['load_wma_1'] = wma(df_pressure['load_wma'], 1)  # this is the same as default summing
df_pressure['load_wma_100'] = wma(df_pressure['load_wma'], 100)
df_pressure['load_wma_1000'] = wma(df_pressure['load_wma'], 1000)
df_pressure['load_wma_2000'] = wma(df_pressure['load_wma'], 2000)

# print(df_pressure)
# plt.figure()  # plot for pyramid shaped load ramping
# plt.plot(df_pressure['step_time'], df_pressure['step_ip'])
# plt.title('Step pressure loading')
# plt.ylabel('Internal Pressure (mbar)')
# plt.xlabel('Time (s)')
plt.figure()  # plot for cyclic pressure loading
plt.plot(df_pressure['cycle_time'], df_pressure['scaled_cycle_ip'])
plt.title('Cyclic pressure loading')
plt.ylabel('Internal Pressure (mbar)')
plt.xlabel('Time (s)')

plt.figure()  # pressure over a sliding sampling window
plt.plot(df_pressure['cycle_time'], df_pressure['load_wma_1'], label='Period 1 (Sum)')
plt.plot(df_pressure['cycle_time'], df_pressure['load_wma_100'], label='Period 100')
plt.plot(df_pressure['cycle_time'], df_pressure['load_wma_1000'], label='Period 1000')
plt.plot(df_pressure['cycle_time'], df_pressure['load_wma_2000'], label='Period 2000')
plt.title(f'WMA Pressure Over {SAMPLE_WINDOW}s Sliding Window')
plt.ylabel('Internal Pressure (mbar)')
plt.xlabel('Time (s)')
plt.legend()
plt.show()

# note about plots: using larger periods makes the data smoother with fewer jumps from fine tune movement
# larger periods also results in end of data stream not having data, but this is probably negligible when we have
# very long datastreams that are not ending. This effect is also reduced with longer window sizes, so prob won't be
# a problem
# Should prob double-check the time sync with activity recognition if using very larger periods, but prob okay


# could implement things like:
# if load (avg over small window) continuing to decrease (at appropriate rate) after notification, stop any more
# notifications until below pressure alert threshold or ~10 minutes, and then start alerting if pressure goes
# above threshold again later?

# Research real thresholds we could start using for when pressure gets dangerous/sore development
