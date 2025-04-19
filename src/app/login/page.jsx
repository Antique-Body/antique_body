import React from "react";
import Background from "../../components/background";
import "./login.css";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative bg-[#0a0a0a] text-white">
      <Background
        parthenon={true}
        runner={true}
        discus={true}
        colosseum={true}
        column={false}
        vase={false}
      />

      <div className="login-container">
        <div className="marble-effect"></div>
        <div className="copper-detail"></div>
        <div className="gold-detail"></div>

        <div className="logo">
          <h1>
            ANTIC <span>BODY</span>
          </h1>
          <div className="logo-tagline">STRENGTH OF THE ANCIENTS</div>
        </div>

        <div className="tabs">
          <div className="tab active" id="trainer-tab">
            TRAINER
          </div>
          <div className="tab" id="user-tab">
            USER
          </div>
          <div className="tab-slider trainer"></div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Login page placeholder - complete version will be implemented in the
          LoginContainer and LoginForm components
        </p>
      </div>
    </main>
  );
}
