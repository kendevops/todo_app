// import React from 'react'
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const Dashboard = () => {
  return (
    <div className="flex flex-col">
      <ModeToggle />
      <div>
        <Button>Click me</Button>
      </div>
    </div>
  );
};

export default Dashboard;
