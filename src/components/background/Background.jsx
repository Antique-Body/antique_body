"use client";

import "./background.css";

// Lazy load icons to reduce initial bundle size
const ParthenonIcon = lazy(() =>
  import("@/components/common/Icons").then((mod) => ({
    default: mod.ParthenonIcon,
  }))
);
const RunnerIcon = lazy(() =>
  import("@/components/common/Icons").then((mod) => ({
    default: mod.RunnerIcon,
  }))
);
const DiscusIcon = lazy(() =>
  import("@/components/common/Icons").then((mod) => ({
    default: mod.DiscusIcon,
  }))
);
const ColosseumIcon = lazy(() =>
  import("@/components/common/Icons").then((mod) => ({
    default: mod.ColosseumIcon,
  }))
);
const ColumnIcon = lazy(() =>
  import("@/components/common/Icons").then((mod) => ({
    default: mod.ColumnIcon,
  }))
);
const VaseIcon = lazy(() =>
  import("@/components/common/Icons").then((mod) => ({ default: mod.VaseIcon }))
);

// Simple placeholder for icons while loading
const IconPlaceholder = () => <div className="w-full h-full bg-transparent" />;

const Background = ({
  parthenon = true,
  runner = true,
  discus = true,
  colosseum = true,
  column = true,
  vase = true,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame for smoother animation start
    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      className={`background-shapes ${className} ${isVisible ? "visible" : ""}`}
    >
      {parthenon && (
        <div
          className="ancient-building parthenon"
          style={{ "--delay": "0.1s" }}
        >
          <Suspense fallback={<IconPlaceholder />}>
            <ParthenonIcon className="w-full h-full" />
          </Suspense>
        </div>
      )}
      {runner && (
        <div className="olympian runner" style={{ "--delay": "0.3s" }}>
          <Suspense fallback={<IconPlaceholder />}>
            <RunnerIcon className="w-full h-full" />
          </Suspense>
        </div>
      )}
      {discus && (
        <div className="olympian discus" style={{ "--delay": "0.5s" }}>
          <Suspense fallback={<IconPlaceholder />}>
            <DiscusIcon className="w-full h-full" />
          </Suspense>
        </div>
      )}
      {colosseum && (
        <div
          className="ancient-building colosseum"
          style={{ "--delay": "0.2s" }}
        >
          <Suspense fallback={<IconPlaceholder />}>
            <ColosseumIcon className="w-full h-full" />
          </Suspense>
        </div>
      )}
      {column && (
        <div className="ancient-building column" style={{ "--delay": "0.4s" }}>
          <Suspense fallback={<IconPlaceholder />}>
            <ColumnIcon className="w-full h-full" />
          </Suspense>
        </div>
      )}
      {vase && (
        <div className="ancient-building vase" style={{ "--delay": "0.6s" }}>
          <Suspense fallback={<IconPlaceholder />}>
            <VaseIcon className="w-full h-full" />
          </Suspense>
        </div>
      )}
    </div>
  );
};

// Memoriranje komponente za prevenciju nepotrebnih renderovanja
export default React.memo(Background);
