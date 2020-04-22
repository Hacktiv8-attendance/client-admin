import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import DashboardBroadcast from '../components/DashboardBroadcast'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAbsence, fetchEmployees } from '../store/actions'
import { Form, Container, Accordion, Image } from 'semantic-ui-react'
import CanvasJSReact from '../canvasjs.react';
import moment from 'moment'
import _ from 'lodash'
import HRDashboard from '../assets/hr_dashboard.svg'

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function Dashboard() {
    const monthOption = [
        {value: '2020-01', text: 'January'},
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
    const [activeAccordion, setActiveAccordion] = useState(3)

    const [clock, setClock] = useState('')
    const greetings = (hour) => {
        if(hour >= 4 && hour < 12) return 'morning'
        if(hour >= 12 && hour <= 18) return 'afternoon'
        else return 'evening'
    }

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2", //"light1", "dark1", "dark2"
        axisX: {
            title: "Name",
            interval: 1
        },
        axisY: {
            title: "Total Absence",
            interval: 2
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
        dispatch(fetchAbsence({ month, SuperiorId }))
    }

    const getName = () => _.chain(localStorage.getItem('email'))
                            .split('@')
                            .head()
                            .replace('.', ' ')
                            .startCase()
                            .value()

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
        setInterval(() => {
            setClock(moment().format("dddd, MMMM Do YYYY, HH:mm:ss"))
        }, 1000)
    }, [history, absence.length, month, employees.length, dispatch, SuperiorId, employees])

    return (
        <div id="dashboard-page">
            <Accordion exclusive={false} fluid styled>
                <Accordion.Title 
                    active={activeAccordion === 3}
                    content="Dashboard"
                    onClick={() => activeAccordion === 3 ? setActiveAccordion(-3) : setActiveAccordion(3) }
                /> 
                <Accordion.Content active={activeAccordion === 3}>
                    <Container id="dashboard-container">
                        <h2 style={{ backgroundColor: "#e4f9f5" }} id="dashboard-greeting">Good {greetings(Number(clock.substr(-8, 2)))} {getName()}, have a nice day! </h2>
                        <Image src={HRDashboard} />
                        <h2 style={{ backgroundColor: "#30e3ca" }} id="dashboard-date">{clock.substr(0, (clock.length - 10))}</h2>
                        <h1 style={{ backgroundColor: "#e4f9f5", fontSize: "4em" }} id="dashboard-time">{clock.substr(-8, 8)}</h1>
                    </Container>
                </Accordion.Content>
                <Accordion.Title
                    active={activeAccordion === 1}
                    content="Monthly Chart"
                    onClick={(event) => activeAccordion === 1 ? setActiveAccordion(-1) : setActiveAccordion(1) }
                />
                <Accordion.Content active={activeAccordion === 1}>
                    <div id="dashboard-chart">
                        <h1 style={{ backgroundColor: "#e4f9f5" }}>Monthly Attendance Report</h1>
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
                                    style={{ backgroundColor : "#30e3ca", color: "white" }}
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
                    onClick={() => activeAccordion === 2 ? setActiveAccordion(-2) : setActiveAccordion(2) }
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
