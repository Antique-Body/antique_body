"use client";

import React from "react";
import "./background.css";

import { ParthenonIcon, RunnerIcon, DiscusIcon, ColosseumIcon, ColumnIcon, VaseIcon } from "@/components/common/Icons";

const Background = () => (
    <div className="background-shapes visible">
        <div className="ancient-building parthenon" style={{ "--delay": "0.1s" }}>
            <ParthenonIcon className="w-full h-full" />
        </div>

        <div className="olympian runner" style={{ "--delay": "0.3s" }}>
            <RunnerIcon className="w-full h-full" />
        </div>

        <div className="olympian discus" style={{ "--delay": "0.5s" }}>
            <DiscusIcon className="w-full h-full" />
        </div>

        <div className="ancient-building colosseum" style={{ "--delay": "0.2s" }}>
            <ColosseumIcon className="w-full h-full" />
        </div>

        <div className="ancient-building column" style={{ "--delay": "0.4s" }}>
            <ColumnIcon className="w-full h-full" />
        </div>

        <div className="ancient-building vase" style={{ "--delay": "0.6s" }}>
            <VaseIcon className="w-full h-full" />
        </div>
    </div>
);

export default Background;
