"use client";

/**
 * LatestCarousel v2 - Kao Thailand Design
 * Infinite loop carousel (5 items) with Splide
 * - 4 cards per page (desktop), 3 (tablet), 1 (mobile)
 * - Image + Category + Title (no "Read more")
 * - Slow scroll: 1.5s transition, 7s per card
 * - Smooth easing, pausable on hover
 */

import { useEffect, useRef, useState } from "react";
import Splide from "@splidejs/splide";

interface CarouselItem {
  id: number;
  img: string;
  category: string;
  title: string;
  href: string;
}

interface Props {
  heading?: string;
  items?: CarouselItem[];
}

const defaultItems: CarouselItem[] = [
  {
    id: 1,
    img: "/images/home/latest-01.jpg",
    category: "PRODUCTS",
    title: "New Product Line Launch",
    href: "/products",
  },
  {
    id: 2,
    img: "/images/home/latest-02.jpg",
    category: "WELLNESS",
    title: "Daily Wellness Routine",
    href: "/wellness",
  },
  {
    id: 3,
    img: "/images/home/latest-03.jpg",
    category: "LIFESTYLE",
    title: "Family Care Excellence",
    href: "/lifestyle",
  },
  {
    id: 4,
    img: "/images/home/latest-04.jpg",
    category: "INNOVATION",
    title: "Research & Development",
    href: "/innovation",
  },
  {
    id: 5,
    img: "/images/home/latest-05.jpg",
    category: "CORPORATE",
    title: "Sustainability Progress",
    href: "/sustainability",
  },
];

export default function LatestCarousel({
  heading = "Latest",
  items = defaultItems,
}: Props) {
  const splideRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!splideRef.current) return;

    const splide = new Splide(splideRef.current, {
      type: "loop",
      rewind: false,
      focus: "center",
      start: 0,
      gap: 24,
      perPage: 1.2,
      autoplay: true,
      interval: 7000,
      speed: 1500,
      easing: "cubic-bezier(.25,.1,.25,1)",
      pauseOnHover: true,
      pauseOnFocus: true,
      arrows: true,
      pagination: true,
      drag: true,
      breakpoints: {
        641: { perPage: 3 },
        1025: { perPage: 4 },
      },
      classes: {
        page: "splide__pagination__page dot",
      },
    });

    splide.mount();

    const toggle = splideRef.current.querySelector(".toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const auto = splide.Components.Autoplay;
        const paused = toggle.classList.toggle("is-stop");
        paused ? auto.pause() : auto.play();
        setIsPaused(paused);
        toggle.setAttribute("aria-label", paused ? "Play" : "Pause");
      });
    }

    return () => splide.destroy();
  }, []);

  return (
    <section className="latest-carousel">
      <h2>{heading}</h2>

      <div className="carousel-root splide" ref={splideRef}>
        <div className="carousel-wrapper">
          <div className="splide__track">
            <ul className="carousel-track splide__list">
              {items.map((item) => (
                <li key={item.id} className="carousel-card splide__slide">
                  <a className="card-link" href={item.href}>
                    <div className="card-media">
                      <img src={item.img} alt={item.title} loading="lazy" />
                    </div>
                    <span className="category">{item.category}</span>
                    <h3>{item.title}</h3>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="carousel-controls">
          <button
            className="arrow arrow--prev"
            aria-label="Previous"
            type="button"
          />
          <ul className="pagination" />
          <button
            className="arrow arrow--next"
            aria-label="Next"
            type="button"
          />
          <button
            className={`toggle ${isPaused ? "is-stop" : ""}`}
            aria-label="Pause"
            type="button"
          />
        </div>
      </div>
    </section>
  );
}
