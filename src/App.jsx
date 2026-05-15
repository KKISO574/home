import { useState } from "react";
import { Cursor, Footer } from "animal-island-ui";
import { IslandContact } from "@/components/react-home/IslandContact.jsx";
import { IslandGate } from "@/components/react-home/IslandGate.jsx";
import { IslandHero } from "@/components/react-home/IslandHero.jsx";
import { IslandLinks } from "@/components/react-home/IslandLinks.jsx";
import { IslandMusic } from "@/components/react-home/IslandMusic.jsx";
import { IslandOverview } from "@/components/react-home/IslandOverview.jsx";
import { useClock } from "@/hooks/useClock.js";
import { useHitokoto } from "@/hooks/useHitokoto.js";
import { useSiteMeta } from "@/hooks/useSiteMeta.js";
import { useTimeCapsule } from "@/hooks/useTimeCapsule.js";
import { useWeather } from "@/hooks/useWeather.js";

const App = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const meta = useSiteMeta();
  const clock = useClock();
  const weather = useWeather();
  const hitokoto = useHitokoto();
  const timeCapsule = useTimeCapsule(meta.startDate);

  const enterHome = () => {
    setHasEntered(true);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  const backToGate = () => {
    setHasEntered(false);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    });
  };

  return (
    <Cursor>
      <div className="island-app">
        {!hasEntered ? (
          <IslandGate
            siteName={meta.siteName}
            siteAuthor={meta.siteAuthor}
            weatherLine={weather.weatherLine}
            locationState={weather.locationState}
            onEnter={enterHome}
          />
        ) : (
          <main className="home-flow">
            <IslandHero
              meta={meta}
              clock={clock}
              weatherLine={weather.weatherLine}
              onBackToGate={backToGate}
            />
            <IslandOverview
              quote={hitokoto.quote}
              quoteLoading={hitokoto.loading}
              onRefreshQuote={hitokoto.refreshQuote}
              weatherState={weather.weatherState}
              weatherLoading={weather.loading}
              onRefreshWeather={weather.refreshWeather}
              capsuleList={timeCapsule.capsuleList}
              siteAge={timeCapsule.siteAge}
            />
            <IslandLinks />
            <IslandMusic />
            <IslandContact meta={meta} siteAge={timeCapsule.siteAge} />
            <Footer type="sea" className="island-footer" />
          </main>
        )}
      </div>
    </Cursor>
  );
};

export default App;
