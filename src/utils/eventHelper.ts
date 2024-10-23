import { SingleCallback, StrategyEvent } from "../types/chart";

export const drawStrategyEvents = (
    chart: Highcharts.Chart,
    events: StrategyEvent[],
    colorMode: string,
    activeEventLines: Set<number>,
    setActiveEventLines: SingleCallback<Set<number>>) => {
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
        const circle = chart.renderer
          .circle(xPos, yPos, 10)
          .attr({
            fill: colorMode === "dark" ? "#ffa500" : "#2563eb",
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
          // Toggle vertical line
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
          } p-2 rounded shadow-lg`;
          tooltipContainer.style.position = "absolute";
          tooltipContainer.style.zIndex = "1000";
          tooltipContainer.innerHTML = `
          <h3 class="font-bold">${event.title}</h3>
          <p>${event.description}</p>
        `;

          // Calculate position
          const chartRect = chart.container.getBoundingClientRect();
          let left = e.clientX - chartRect.left + 10;
          let top = e.clientY - chartRect.top + 10;

          // Adjust position if it goes beyond the right edge of the plot area
          if (left + 200 > chart.plotWidth) {
            left = Math.max(0, chart.plotWidth - 200);
          }

          // Adjust position if it goes beyond the bottom edge of the plot area
          if (top + tooltipContainer.offsetHeight > chart.plotHeight) {
            top = Math.max(
              0,
              chart.plotHeight - tooltipContainer.offsetHeight
            );
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