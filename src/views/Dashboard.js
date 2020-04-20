import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import DashboardBroadcast from '../components/DashboardBroadcast'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAbsence, fetchEmployees } from '../store/actions'
import { Form, Container, Accordion } from 'semantic-ui-react'
import CanvasJSReact from '../canvasjs.react';
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
    const [activeAccordion, setActiveAccordion] = useState(0)

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
                }
                return null
            })
            setOption(manager)
        }
    }, [history, absence.length, month, employees.length, dispatch, SuperiorId, employees])
    return (
        <div id="dashboard-page">
            <Accordion exclusive={false} fluid styled>
                <Accordion.Title
                    active={activeAccordion === 1}
                    content="Monthly Chart"
                    onClick={(event) => activeAccordion === 1 ? setActiveAccordion(-1) : setActiveAccordion(1) }
                />
                <Accordion.Content active={activeAccordion === 1}>
                    <div id="dashboard-chart">
                        <h1>Monthly Attendance Report</h1>
                        <Form loading={loading} className="dashboard-chart-form">
                            <Form.Group widths='equal'>
                                <Form.Select 
                                    placeholder='Month'
                                    options={monthOption}
                                    onChange={(event, { value }) => setMonth(value)}
                                />
                                <Form.Select 
                                    placeholder='Manager'
                                    options={option}
                                    onChange={(event, { value }) => setSuperiorId(value)}
                                />
                                <Form.Button 
                                    onClick={(event) => handleClick(event)} 
                                    content="Submit" 
                                />                            
                            </Form.Group>
                        </Form>
                        <CanvasJSChart options={options} />
                            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                    </div>
                </Accordion.Content>
                <Accordion.Title
                    active={activeAccordion === 2}
                    content="Broadcast Message"
                    onClick={(event) => activeAccordion === 2 ? setActiveAccordion(-2) : setActiveAccordion(2) }
                />
                <Accordion.Content active={activeAccordion === 2}>
                    <Container>
                        <DashboardBroadcast />
                    </Container>
                </Accordion.Content>

            </Accordion>
        </div>
    )
}
