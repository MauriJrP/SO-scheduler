import { useState, useEffect } from 'react';
import LinearWithValueLabel from './ProgressBar';
import {Card, CardContent, Button} from '@mui/material';
import Form from './Form';
import {IScheduler, IProcess} from './types';

export default function App() {
  const [cont, setCont] = useState<number>(0)
  const [cont2, setCont2] = useState<number>(0)
  const [cont3, setCont3] = useState<number>(0)
  const [process, setProcess] = useState<string>("")
  const [process2, setProcess2] = useState<string>("")
  const [process3, setProcess3] = useState<string>("")

  let worker: Worker;
  let worker2: Worker;
  let worker3: Worker;

  const [schedulers, setSchedulers] = useState<IScheduler[]>([{
    algorithm: "FCFS",
    processes: [
      {process: 'A', time: 5},
      {process: 'B', time: 2},
      {process: 'C', time: 3},
    ]
    },{
      algorithm: "RR",
      processes: [
        {process: 'D', time: 2},
        {process: 'E', time: 6},
        {process: 'F', time: 2},
      ],
      quantum: 2,
    },{
      algorithm: "RR",
      processes: [
        {process: 'G', time: 3},
        {process: 'H', time: 2},
        {process: 'I', time: 5},
      ],
      quantum: 3,
    }
  ])

  const getTotalTime = (processes: IProcess[]) => {
    return processes.reduce((total, process) => total + process.time, 0)
  }


  const handleClick = async () => {
    resetStates();
    worker = new Worker('worker.js');
    worker2 = new Worker('worker.js');
    worker3 = new Worker('worker.js');
    worker.postMessage(schedulers[0]);
    worker.onmessage = (e) => {
      // const steps = getTotalTime(schedulers[0].processes) / e.data.time;
      setCont((prevState) => prevState + (100 / schedulers[0].processes.length));
      setProcess(e.data.process)
    }

    worker2.postMessage(schedulers[1]);
    worker2.onmessage = (e) => {
      if (schedulers[1].quantum) {
        const steps = (100 / getTotalTime(schedulers[1].processes)) * e.data.time;
        // console.log( getTotalTime(schedulers[1].processes))
        setCont2((prevState) => prevState + steps)
        setProcess2(e.data.process)
      }
    }

    worker3.postMessage(schedulers[2]);
    worker3.onmessage = (e) => {
      if (schedulers[2].quantum) {
        const steps = (100 / getTotalTime(schedulers[2].processes)) * e.data.time;
        // const steps = getTotalTime(schedulers[2].processes) / e.data.time;
        setCont3((prevState) => prevState + steps)
        setProcess3(e.data.process)
      }
    }
  }

  const resetStates = () => {
    setCont(0)
    setProcess("")
    setCont2(0)
    setProcess2("")
    setCont3(0)
    setProcess3("")
  }

  const addProcess = (index: number, process: string, time: number) => {
    const newProcess: IProcess = { process, time };
    setSchedulers((prevState:IScheduler[]) => {
      return prevState.map((scheduler:IScheduler, i: number) => {
        if (i === index) {
          const newScheduler: IScheduler = {
            ...scheduler,
            processes: [...scheduler.processes, newProcess]
          }
          return newScheduler
        }
        return scheduler
      })
    })
  }

  const forms = schedulers.map((scheduler, index) => {
    return <Form key={index} scheduler={scheduler} addProcess={addProcess} index={index}/>
  })


  return (
    <div className="container flex flex-col h-screen items-center p-5 mx-auto">
      <h1 className="text-3xl m-5">Simulador de procesos MLQ</h1>
      <div className="grid grid-cols-3 gap-2">
        {forms}
      </div>
      <Card sx={{ minWidth: 275 }} className="mt-10 w-1/2">
        <CardContent>
          <p>{process}</p>
          <LinearWithValueLabel progress={cont}/>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275 }} className="mt-10 w-1/2">
        <CardContent>
          <p>{process2}</p>
          <LinearWithValueLabel progress={cont2}/>
        </CardContent>
      </Card>
      <Card sx={{ minWidth: 275 }} className="mt-10 w-1/2">
        <CardContent>
          <p>{process3}</p>
          <LinearWithValueLabel progress={cont3}/>
        </CardContent>
      </Card>
      <Button variant="contained" onClick={handleClick} className="mt-10">Comenzar</Button>
    </div>
  );
}