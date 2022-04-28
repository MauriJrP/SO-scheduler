import React from 'react'
import {IScheduler} from './types'
import {Card, CardContent, Button, TextField} from '@mui/material';

interface IProps {
  scheduler: IScheduler;
  addProcess: (index: number, process: string, time: number) => void;
  index: number;
}

export default function Form(props: IProps) {
  const [formData, setFormData] = React.useState({
    process: '',
    time: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))};

  const handleClick = () => {
    console.log(props.index, formData.process, formData.time);
    props.addProcess( props.index, formData.process, formData.time);
  }

  const processes = props.scheduler.processes.map((process, index) => {
    return (<div className="flex" key={index}>
      <p>{process.process}</p>
      <p>:  {process.time}</p>
    </div>)
  })

  return (
    <Card sx={{ minWidth: 275 }} className="mt-10 w-1/2 mx-auto">
      <CardContent className="flex flex-col">
        <p>Planificador: {props.scheduler.algorithm}</p>
        {props.scheduler.quantum && <p>Quantum: {props.scheduler.quantum}</p>}
        {processes}
        <div className="flex gap-2 mt-2">
          <TextField
            label="Proceso"
            size="small"
            name="process"
            value={formData.process}
            onChange={handleChange}
          />
          <TextField
            label="Tiempo"
            type="number"
            name="time"
            size="small"
            value={formData.time}
            onChange={handleChange}
          />
        </div>
        <Button variant="contained" onClick={handleClick} fullWidth className="mt-2">Agregar</Button>
      </CardContent>
    </Card>
  )
}
