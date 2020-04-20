import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAbsence, fetchEmployees } from '../store/actions'
import { Form, Button } from 'semantic-ui-react'
import CanvasJSReact from '../canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Dashboard() {
    const monthOption = [
        {key: "asd", value: '2020-01', text: 'January'},
        {value: '2020-02', text: 'February'},
        {value: '2020-03', text: 'March'},
        {value: '2020-04', text: 'April'},
        {value: '2020-05', text: 'May'},
        {value: '2020-06', text: 'June'},
        {value: '2020-07', text: 'July'},
        {value: '2020-08', text: 'August'},
        {value: '2020-09', text: 'September'},
        {value: '2020-10', text: 'October'},
        {value: '2020-11', text: 'November'},
        {value: '2020-12', text: 'December'},   
    ]
    let absence = useSelector(state => state.reducers.absence)
    let employees = useSelector(state => state.reducers.employees)
    const loading = useSelector(state => state.reducers.loading)
    const history = useHistory()
    const dispatch = useDispatch()

    const [month, setMonth] = useState("2020-03")
    const [SuperiorId, setSuperiorId] = useState(2)
    const [option, setOption] = useState([])

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", //"light1", "dark1", "dark2"
        title:{
            text: "Simple Column Chart with Index Labels"
        },
        axisX: {
            interval: 1
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelPlacement: "outside",
            dataPoints: absence
        }]
    }
    
    const handleClick = (event) => {
        event.preventDefault()
        console.log(month, SuperiorId)
        dispatch(fetchAbsence({month, SuperiorId}))
    }

    useEffect(() => {
        if(localStorage.getItem('qr')) {
            history.replace('/qr')
        }
        if(absence.length === 0) {
            dispatch(fetchAbsence({month, SuperiorId}))
        }
        if(employees.length === 0) {
            dispatch(fetchEmployees())
        } else {
            const manager = []
            employees.map(el => {
                if(el.authLevel === 2) {
                    const payload = {
                        text: el.name,
                        value: el.id
                    }
                    manager.push(payload)
                    return
                }
            })
            setOption(manager)
        }
    }, [history, absence.length, month, employees.length, dispatch, SuperiorId, employees])
    if(loading) return <div>Loading....</div>
    return (
        <div id="dashboard-page">
            <div id="dashboard-display">
                <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Select 
                            // fluid
                            label="Month" 
                            placeholder='Month'
                            options={monthOption}
                            onChange={(event, { value }) => setMonth(value)}
                        />
                        <Form.Select 
                            fluid
                            label="Manager" 
                            placeholder='Manager'
                            options={option}
                            onChange={(event, { value }) => setSuperiorId(value)}
                        />
                    </Form.Group>
                    <Button primary onClick={(event) => handleClick(event)} content="Submit" />
                </Form>
                <CanvasJSChart options = {options}
                        /* onRef={ref => this.chart = ref} */
                    />
                    {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                </div>
            </div>
        </div>
    )
}
