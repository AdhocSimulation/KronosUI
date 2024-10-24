import { SingleCallback, StrategyEvent } from "../types/chart";

export const drawStrategyEvents = (
  chart: Highcharts.Chart,
  events: StrategyEvent[],
  colorMode: string,
  activeEventLines: Set<number>,
  setActiveEventLines: SingleCallback<Set<number>>
) => {
  // Remove existing event elements
  chart.renderer.boxWrapper.element
    .querySelectorAll(".event-element")
    .forEach((el) => el.remove());

  const xAxis = chart.xAxis[0];
  const yAxis = chart.yAxis[0];
  const chartLeft = chart.plotLeft;
  const chartRight = chart.plotLeft + chart.plotWidth;
  const chartTop = chart.plotTop;
  const chartBottom = chart.plotTop + chart.plotHeight;

  events.forEach((event) => {
    const xPos = xAxis.toPixels(event.date);
    const yPos = yAxis.toPixels(yAxis.getExtremes().min);

    if (
      xPos !== undefined &&
      yPos !== undefined &&
      xPos >= chartLeft &&
      xPos <= chartRight &&
      yPos >= chartTop &&
      yPos <= chartBottom
    ) {
      const circleColor =
        event.type === "global"
          ? colorMode === "dark"
            ? "#ffa500"
            : "#2563eb"
          : colorMode === "dark"
          ? "#22c55e"
          : "#16a34a";

      const circle = chart.renderer
        .circle(xPos, yPos, 10)
        .attr({
          fill: circleColor,
          zIndex: 5,
          class: "event-element",
        })
        .css({
          cursor: "pointer",
        })
        .add();

      chart.renderer
        .text(event.title, xPos - 20, yPos + 20)
        .attr({
          zIndex: 5,
          class: "event-element",
        })
        .css({
          color: colorMode === "dark" ? "#e5e7eb" : "#111827",
          fontSize: "10px",
          cursor: "pointer",
        })
        .add();

      // Add click event to the circle
      (circle.element as HTMLElement).onclick = () => {
        if (activeEventLines.has(event.date)) {
          activeEventLines.delete(event.date);
          chart.renderer.boxWrapper.element
            .querySelector(`.vertical-line-${event.date}`)
            ?.remove();
        } else {
          activeEventLines.add(event.date);
          chart.renderer
            .path(["M", xPos, chartTop, "L", xPos, chartBottom])
            .attr({
              "stroke-width": 1,
              stroke: colorMode === "dark" ? "#e5e7eb" : "#4b5563",
              dashstyle: "shortdash",
              zIndex: 4,
              class: `vertical-line-${event.date} event-element`,
            })
            .add();
        }
        setActiveEventLines(new Set(activeEventLines));
      };

      // Add hover event to the circle
      (circle.element as HTMLElement).onmouseover = (e: MouseEvent) => {
        const tooltipContainer = document.createElement("div");
        tooltipContainer.className = `event-tooltip ${
          colorMode === "dark"
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-800"
        } p-4 rounded-lg shadow-lg max-w-sm`;
        tooltipContainer.style.position = "absolute";
        tooltipContainer.style.zIndex = "1000";

        const eventTypeClass =
          event.type === "global"
            ? colorMode === "dark"
              ? "text-orange-400"
              : "text-blue-600"
            : colorMode === "dark"
            ? "text-green-400"
            : "text-green-600";

        tooltipContainer.innerHTML = `
            <div class="flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-lg">${event.title}</h3>
                <span class="${eventTypeClass} text-sm">${
          event.type === "global" ? "Global Event" : "Stock Event"
        }</span>
              </div>
              ${
                event.category
                  ? `<div class="text-sm opacity-75">${event.category}</div>`
                  : ""
              }
              ${
                event.stock
                  ? `<div class="text-sm ${
                      colorMode === "dark" ? "text-blue-400" : "text-blue-600"
                    }">${event.stock}</div>`
                  : ""
              }
              <p class="text-sm mt-1">${event.description}</p>
            </div>
          `;

        // Calculate position
        const chartRect = chart.container.getBoundingClientRect();
        let left = e.clientX - chartRect.left + 10;
        let top = e.clientY - chartRect.top + 10;

        if (left + 320 > chart.plotWidth) {
          left = Math.max(0, chart.plotWidth - 320);
        }

        if (top + tooltipContainer.offsetHeight > chart.plotHeight) {
          top = Math.max(0, chart.plotHeight - tooltipContainer.offsetHeight);
        }

        tooltipContainer.style.left = `${left}px`;
        tooltipContainer.style.top = `${top}px`;

        chart.container.appendChild(tooltipContainer);
      };

      (circle.element as HTMLElement).onmouseout = () => {
        const tooltipContainer = document.querySelector(".event-tooltip");
        if (tooltipContainer) {
          tooltipContainer.remove();
        }
      };

      // Redraw active event lines
      if (activeEventLines.has(event.date)) {
        chart.renderer
          .path(["M", xPos, chartTop, "L", xPos, chartBottom])
          .attr({
            "stroke-width": 1,
            stroke: colorMode === "dark" ? "#e5e7eb" : "#4b5563",
            dashstyle: "shortdash",
            zIndex: 4,
            class: `vertical-line-${event.date} event-element`,
          })
          .add();
      }
    }
  });
};
