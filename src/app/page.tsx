'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";


export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Welcome to SNIF
            <Badge variant="secondary">Beta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              width={72}
              height={16}
              className="dark:invert"
            />
          </div>
          
          <div className="space-y-2">
            <Button className="w-full">Primary Action</Button>
            <Button variant="outline" className="w-full">Secondary Action</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}