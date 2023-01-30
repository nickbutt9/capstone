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
df_pressure['load'] = df_pressure['scaled_cycle_ip'].rolling(min_periods=1, window=samples_needed).sum()

# print(df_pressure)
plt.figure()
plt.plot(df_pressure['step_time'], df_pressure['step_ip'])
plt.title('Step pressure loading')
plt.ylabel('Internal Pressure (mbar)')
plt.xlabel('Time (s)')
plt.figure()
plt.plot(df_pressure['cycle_time'], df_pressure['scaled_cycle_ip'])
plt.title('Cyclic pressure loading')
plt.ylabel('Internal Pressure (mbar)')
plt.xlabel('Time (s)')
plt.figure()
plt.plot(df_pressure['cycle_time'], df_pressure['load'])
plt.title(f'Total Pressure Over {SAMPLE_WINDOW}s Sliding Window')
plt.ylabel('Internal Pressure (mbar)')
plt.xlabel('Time (s)')
plt.show()

# could implement things like:
# if load (avg over small window) continuing to decrease (at appropriate rate) after notification, stop any more
# notifications until below pressure alert threshold or ~10 minutes, and then start alerting if pressure goes
# above threshold again later?

# potentially weigh more recent pressure values more strongly than those from further back? need to look into that
# maybe by applying a lambda to the rolling call, or maybe df.ewm
# Make sure weights still add up to 1

# Research real thresholds we could start using for when pressure gets dangerous/sore development
