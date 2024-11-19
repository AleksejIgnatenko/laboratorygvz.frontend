"use client";

import { useEffect } from "react";
import "./style.css";

export default function Home() {
  useEffect(() => {
    const nextButton = document.getElementById("next") as HTMLButtonElement;
    const prevButton = document.getElementById("prev") as HTMLButtonElement;
    const carousel = document.querySelector(".carousel") as HTMLElement;
    const listHTML = document.querySelector(".carousel .list") as HTMLElement;
    const seeMoreButtons = document.querySelectorAll(
      ".seeMore"
    ) as NodeListOf<HTMLButtonElement>;
    const backButton = document.getElementById("back") as HTMLButtonElement;

    nextButton.onclick = function () {
      showSlider("next");
    };
    prevButton.onclick = function () {
      showSlider("prev");
    };

    let unAcceppClick: NodeJS.Timeout | undefined;

    const showSlider = (type: "next" | "prev") => {
      nextButton.style.pointerEvents = "none";
      prevButton.style.pointerEvents = "none";

      carousel.classList.remove("next", "prev");
      const items = document.querySelectorAll(
        ".carousel .list .item"
      ) as NodeListOf<HTMLElement>; // Changed to const
      if (type === "next") {
        listHTML.appendChild(items[0]);
        carousel.classList.add("next");
      } else {
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add("prev");
      }

      if (unAcceppClick) {
        clearTimeout(unAcceppClick);
      }
      unAcceppClick = setTimeout(() => {
        nextButton.style.pointerEvents = "auto";
        prevButton.style.pointerEvents = "auto";
      }, 2000);
    };

    seeMoreButtons.forEach((button) => {
      button.onclick = function () {
        carousel.classList.remove("next", "prev");
        carousel.classList.add("showDetail");
      };
    });

    backButton.onclick = function () {
      carousel.classList.remove("showDetail");
    };
  }, []);

  return (
    <div className="page">
      <div className="carousel">
        <div className="list">
          <div className="item">
            <img src="/images/microscope.png" />
            <div className="introduce">
              {/* <div className="title">DESIGN SLIDER</div> */}
              <div className="topic">Микроскоп</div>
              <div className="des">
                Это оптический или электронный прибор, предназначенный для
                увеличения изображения мелких объектов, которые невозможно
                рассмотреть невооруженным глазом. Микроскопы используются в
                различных областях, включая биологию, медицину, материаловедение
                и инженерные науки.
              </div>
              <button className="seeMore">УЗНАТЬ БОЛЬШЕ ↗</button>
            </div>
            <div className="detail">
              <div className="title">Микроскоп</div>
              <div className="des">
                Существует несколько типов микроскопов:
                <br />
                Оптический микроскоп: использует свет и линзы для увеличения
                изображения. Подходит для изучения живых образцов.
                <br />
                Электронный микроскоп: использует электронные лучи, что
                позволяет достигать высокого разрешения и увеличения.
                Применяется для детального анализа микроструктур.
                <br />
                Микроскопы позволяют исследователям изучать клетки,
                микроорганизмы и материалы, играя важную роль в научных
                исследованиях и образовательных процессах.
              </div>
              {/* <div className="specifications">
                <div>
                  <p>Used Time</p>
                  <p>6 hours</p>
                </div>
                <div>
                  <p>Charging port</p>
                  <p>Type-C</p>
                </div>
                <div>
                  <p>Compatible</p>
                  <p>Android</p>
                </div>
                <div>
                  <p>Bluetooth</p>
                  <p>5.3</p>
                </div>
                <div>
                  <p>Controlled</p>
                  <p>Touch</p>
                </div>
              </div> */}
              {/* <div className="checkout">
              <button>ADD TO CART</button>
              <button>CHECKOUT</button>
            </div> */}
            </div>
          </div>

          <div className="item">
            <img src="/images/test-tube.png" />
            <div className="introduce">
              {/* <div className="title">DESIGN SLIDER</div> */}
              <div className="topic">Пробирка</div>
              <div className="des">
                Это лабораторная посуда, обычно цилиндрической формы,
                используемая для хранения, смешивания и проведения химических
                реакций с жидкими веществами. Пробирки изготовлены из стекла или
                пластика и могут иметь различную емкость и диаметр.
              </div>
              <button className="seeMore">УЗНАТЬ БОЛЬШЕ ↗</button>
            </div>
            <div className="detail">
              <div className="title">Пробирка</div>
              <div className="des">
                Материал: Обычно изготавливаются из боросиликатного стекла или
                специального пластика, что обеспечивает прочность и
                термостойкость.
                <br />
                Форма: Цилиндрическая с открытым верхом, иногда с закругленным
                дном для удобства перемешивания.
                <br />
                Объем: Доступны в различных объемах (от нескольких миллилитров
                до сотен миллилитров).
                <br />
                Использование: Пробирки применяются в химических, биологических
                и медицинских лабораториях для проведения экспериментов,
                хранения реагентов и образцов.
              </div>
              {/* <div className="specifications">
                <div>
                  <p>Used Time</p>
                  <p>6 hours</p>
                </div>
                <div>
                  <p>Charging port</p>
                  <p>Type-C</p>
                </div>
                <div>
                  <p>Compatible</p>
                  <p>Android</p>
                </div>
                <div>
                  <p>Bluetooth</p>
                  <p>5.3</p>
                </div>
                <div>
                  <p>Controlled</p>
                  <p>Touch</p>
                </div>
              </div> */}
              {/* <div className="checkout">
              <button>ADD TO CART</button>
              <button>CHECKOUT</button>
            </div> */}
            </div>
          </div>

          <div className="item">
            <img src="/images/fridge.png" />
            <div className="introduce">
              {/* <div className="title">DESIGN SLIDER</div> */}
              <div className="topic">Хладостат</div>
              <div className="des">
                Это лабораторное оборудование, предназначенное для поддержания
                низких температур и создания холодной среды для хранения
                образцов и проведения экспериментов. Он используется в различных
                научных и медицинских исследованиях, где требуется
                контролируемая температура.
              </div>
              <button className="seeMore">УЗНАТЬ БОЛЬШЕ ↗</button>
            </div>
            <div className="detail">
              <div className="title">Хладостат</div>
              <div className="des">
                Хладостаты могут быть использованы для хранения биологических
                образцов, реактивов, а также для проведения термических
                испытаний и реакций, требующих низких температур. Устройства
                могут быть различных типов, включая:
                <br />
                Холодильные камеры: Для хранения образцов при постоянной
                температуре.
                <br />
                Криостаты: Для достижения очень низких температур, часто
                используются в криобиологии и физике.
                <br />
                <br />
                Хладостаты обеспечивают надежное и стабильное охлаждение, что
                критично для сохранения целостности и активности биологических и
                химических образцов.
              </div>
              {/* <div className="specifications">
                <div>
                  <p>Used Time</p>
                  <p>6 hours</p>
                </div>
                <div>
                  <p>Charging port</p>
                  <p>Type-C</p>
                </div>
                <div>
                  <p>Compatible</p>
                  <p>Android</p>
                </div>
                <div>
                  <p>Bluetooth</p>
                  <p>5.3</p>
                </div>
                <div>
                  <p>Controlled</p>
                  <p>Touch</p>
                </div>
              </div> */}
              {/* <div className="checkout">
              <button>ADD TO CART</button>
              <button>CHECKOUT</button>
            </div> */}
            </div>
          </div>

          <div className="item">
            <img src="/images/thermostat.png" />
            <div className="introduce">
              {/* <div className="title">DESIGN SLIDER</div> */}
              <div className="topic">Термостат</div>
              <div className="des">
                Это лабораторное оборудование, предназначенное для поддержания
                заданной температуры в пределах определенного диапазона. Он
                широко используется в научных и медицинских исследованиях, где
                необходима строгая температурная стабильность для проведения
                экспериментов и хранения образцов.
              </div>
              <button className="seeMore">УЗНАТЬ БОЛЬШЕ ↗</button>
            </div>
            <div className="detail">
              <div className="title">Термостат</div>
              <div className="des">
                Термостаты могут быть использованы для различных целей, включая:
                <br />
                Контроль температуры: Обеспечение стабильной температуры для
                реакции или процесса, что критично для получения воспроизводимых
                результатов.
                <br />
                Сохранение образцов: Поддержание необходимой температуры для
                хранения биологических или химических материалов.
                <br />
                Тестирование: Используются в термических испытаниях для оценки
                поведения материалов при различных температурах.
                <br />
                <br />
                Термостаты могут быть различных типов, включая водяные, масляные
                и воздушные термостаты, и могут обладать функциями нагрева и
                охлаждения. Эти устройства гарантируют точный контроль
                температуры, что является важным аспектом в лабораторных
                исследованиях.
              </div>
              {/* <div className="specifications">
                <div>
                  <p>Used Time</p>
                  <p>6 hours</p>
                </div>
                <div>
                  <p>Charging port</p>
                  <p>Type-C</p>
                </div>
                <div>
                  <p>Compatible</p>
                  <p>Android</p>
                </div>
                <div>
                  <p>Bluetooth</p>
                  <p>5.3</p>
                </div>
                <div>
                  <p>Controlled</p>
                  <p>Touch</p>
                </div>
              </div> */}
              {/* <div className="checkout">
              <button>ADD TO CART</button>
              <button>CHECKOUT</button>
            </div> */}
            </div>
          </div>
        </div>
        <div className="arrows">
          <button id="prev">&lt;</button>
          <button id="next">&gt;</button>
          <button id="back">Смотреть все ↗</button>
        </div>
      </div>
    </div>
  );
}
