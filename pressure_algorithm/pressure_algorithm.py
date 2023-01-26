import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# print(os.getcwd() + '\Manuscript Excel Figures.xlsx')
excel_path = os.getcwd() + '\Manuscript Excel Figures.xlsx'

excel_sheet = pd.ExcelFile(excel_path)
df_pressure = pd.read_excel(excel_sheet, 'capstone_sample')
# have to drop unnamed columns that come from the manuscript excel file having weird formatting
df_pressure = df_pressure[df_pressure.columns.drop(list(df_pressure.filter(regex='Unnamed:')))]

# print(df_pressure)
plt.plot(df_pressure['time'], df_pressure['internal_pressure'])
plt.show()
