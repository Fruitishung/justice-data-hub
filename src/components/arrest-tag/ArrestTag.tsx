
import React from "react";
import { Card } from "@/components/ui/card";
import MugshotForm from "./mugshot/MugshotForm";
import MugshotDisplay from "./MugshotDisplay";

const ArrestTag = () => {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Arrest Tag Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 col-span-1">
          <MugshotForm />
        </Card>
        
        <Card className="p-6 col-span-1 lg:col-span-2">
          <MugshotDisplay />
        </Card>
      </div>
    </div>
  );
};

export default ArrestTag;
