import pandas as pd 
import sqlite3
import dash 
from dash import dcc, html
import plotly.express as px 
import requests
from flask_cors import CORS     
from dash.dependencies import Input, Output, State
from pytz import timezone

def pegaDados():
    urlData = 'http://192.168.0.178:8080/clp'

    response = requests.get(urlData)
    dadosJson = response.json()

    df = pd.DataFrame(dadosJson)

    df['TimeStamp'] = pd.to_datetime(df['TimeStamp'])
    if df['TimeStamp'].dt.tz is None:
        df['TimeStamp'] = df['TimeStamp'].dt.tz_localize('UTC').dt.tz_convert('America/Sao_Paulo')
    else:
        df['TimeStamp'] = df['TimeStamp'].dt.tz_convert('America/Sao_Paulo')

    df['data'] = df['TimeStamp'].dt.date
    df['hora'] = df['TimeStamp'].dt.hour
    df['minuto'] = df['TimeStamp'].dt.minute
    df['segundo'] = df['TimeStamp'].dt.second
    df['Msg'] = pd.to_numeric(df['Msg'], errors="coerce")
    df = df.dropna(subset=["Msg"])

    return df

df = pegaDados()


fig = px.scatter(df, x='TimeStamp', y='Msg')

app = dash.Dash(__name__)
server = app.server
CORS(server, resources={r'*': {'origins':'*'}})

app.layout = html.Div(children=[
    html.H1(children='DashboardData'),
    dcc.DatePickerRange(
        id='date_filter',
        start_date = df['TimeStamp'].min().strftime('%Y-%m-%d'),
        end_date=df['TimeStamp'].max().strftime('%Y-%m-%d'),
        min_date_allowed=df['TimeStamp'].min().strftime('%Y-%m-%d'),
        max_date_allowed=df['TimeStamp'].max().strftime('%Y-%m-%d'),
    ),
    dcc.Interval(
        id='interval-component',
        interval=1*1000,
        n_intervals = 0,
    ),
    dcc.Graph(
        id='teste',
        figure=fig,
    )
])

@app.callback(
    Output('teste', 'figure'),
    [Input('date_filter', 'start_date'),
    Input('date_filter', 'end_date'),
    Input('interval-component', 'n_intervals')]
)
def atualizaDash(start_date, end_date, n_intervals):
    print(f"start date:{start_date}\nend date:{end_date}\n")
    if not start_date or not end_date:
        raise dash.exceptions.PreventUpdate
    
    df = pegaDados()
    
    startDateAware = pd.to_datetime(start_date).tz_localize('America/Sao_Paulo')
    endDateAware = pd.to_datetime(end_date).tz_localize('America/Sao_Paulo') + pd.Timedelta(days=1) - pd.Timedelta(seconds=1)
    
    filteredDf = df[(df['TimeStamp'] >= startDateAware) & (df['TimeStamp'] <= endDateAware)]

    print(filteredDf.head())

    figFiltered = px.line(filteredDf, x='TimeStamp', y='Msg', markers=True)

    return figFiltered

if __name__ == '__main__':
    app.run_server(debug=True, host='192.168.0.178', port=4000)