import { FlowArena } from "../components/FlowBuilder/FlowArena";
import { ReactFlowProvider } from "reactflow";
import { CodePreview } from "../components/CodePreview";
import { ModeProvider } from "../components/stores/ModeProvider";
import { Controller, useController } from "../components/stores/Controller";
import { GitHubLogoIcon, ResetIcon } from "@radix-ui/react-icons";

function Header() {
  const {
    reset,
    state: { activeFlowId, flows },
  } = useController();
  const activeFlow = flows.find((f) => f.id === activeFlowId);
  return (
    <header className="h-14 w-full bg-neutral-100">
      <div className="w-full h-full flex items-center justify-between px-2">
        <div className="select-none align-middle flex items-center">
          <h1 className="text-xl font-bold text-slate-800">Flow Editor</h1>
          {activeFlow && (
            <>
              <span className="text-2xl font-bold mx-1">/</span>
              <span className="text-base tracking-tight">{activeFlow.name}</span>
            </>
          )}
        </div>
        <div className="right space-x-2">
          <button
            onClick={async () => {
              // confirm
              if (confirm("Are you sure you want to reset?")) {
                reset();
              }
            }}
            className="text-sm px-2 py-1 text-white font-medium rounded bg-rose-500"
          >
            <span>reset</span>
            <ResetIcon className="inline-block ml-1" />
          </button>
          <a
            href="https://github.com/openchatai/copilot-flows-editor"
            className="text-lg p-2 inline hover:bg-slate-50 rounded cursor-pointer font-medium"
          >
            <GitHubLogoIcon className="inline" />
          </a>
        </div>
      </div>
    </header>
  );
}

export default function FlowBuilder() {
  return (
    <Controller>
      <ModeProvider>
        <ReactFlowProvider>
          <div className="w-full h-screen relative flex items-start flex-col font-openSans overflow-hidden">
            <Header />
            <div className="flex items-start justify-between relative w-full flex-1 overflow-hidden">
              <FlowArena />
              <CodePreview />
            </div>
          </div>
        </ReactFlowProvider>
      </ModeProvider>
    </Controller>
  );
}
