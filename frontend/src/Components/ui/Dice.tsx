import React from "react";

const Dice3D: React.FC = () => {
  return (
    <div className="relative w-[80px] h-[80px] perspective-[600px]">
      {/* Dice */}
      <div
        id="dice"
        className="absolute w-[80px] h-[80px]"
        style={{
          transformStyle: "preserve-3d",
          animation: "spin-slow 10s linear infinite",
        }}
      >
        {/* Các mặt xúc xắc */}
        <div className="side front"><div className="dot center"></div></div>
        <div className="side top">
          <div className="dot dtop dleft"></div>
          <div className="dot dbottom dright"></div>
        </div>
        <div className="side right">
          <div className="dot dtop dleft"></div>
          <div className="dot center"></div>
          <div className="dot dbottom dright"></div>
        </div>
        <div className="side left">
          <div className="dot dtop dleft"></div>
          <div className="dot dtop dright"></div>
          <div className="dot dbottom dleft"></div>
          <div className="dot dbottom dright"></div>
        </div>
        <div className="side bottom">
          <div className="dot center"></div>
          <div className="dot dtop dleft"></div>
          <div className="dot dtop dright"></div>
          <div className="dot dbottom dleft"></div>
          <div className="dot dbottom dright"></div>
        </div>
        <div className="side back">
          <div className="dot dtop dleft"></div>
          <div className="dot dtop dright"></div>
          <div className="dot dbottom dleft"></div>
          <div className="dot dbottom dright"></div>
          <div className="dot center dleft"></div>
          <div className="dot center dright"></div>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: translateZ(-40px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: translateZ(-40px) rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        .side {
          position: absolute;
          width: 80px;
          height: 80px;
          background: #fff;
          border-radius: 16px;
          box-shadow: inset 0 0 15px #ccc;
        }

        #dice .front  { transform: translateZ(40px); }
        #dice .back   { transform: rotateX(-180deg) translateZ(40px); }
        #dice .right  { transform: rotateY(90deg) translateZ(40px); }
        #dice .left   { transform: rotateY(-90deg) translateZ(40px); }
        #dice .top    { transform: rotateX(90deg) translateZ(40px); }
        #dice .bottom { transform: rotateX(-90deg) translateZ(40px); }

        .dot {
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #444;
          box-shadow: inset 2px 0 4px #000;
        }
        .dot.center { margin: 31px 0 0 31px; }
        .dot.dtop { margin-top: 10px; }
        .dot.dbottom { margin-top: 52px; }
        .dot.dleft { margin-left: 52px; }
        .dot.dright { margin-left: 10px; }
        .dot.center.dleft { margin: 31px 0 0 10px; }
        .dot.center.dright { margin: 31px 0 0 52px; }
      `}</style>
    </div>
  );
};

export default Dice3D;
