const startPauseBtn = document.querySelector(".start-pause-btn"), //кнопка для старта анимации
  loadingLineContainer = document.querySelector(".time-line"), // контейнер с линией загрузки
  loadingLine = document.querySelector(".loading-line"), // линия загрузки
  speedLineBtn = document.querySelector("#speed-line-btn"), //Кнопка скорости
  animationReset = document.querySelector(".btn-reset"), //кнопка сброса анимации
  body = document.querySelector("body"), //body
  INPUTS = document.querySelectorAll(".input"), // все инпуты
  SELECTORS = document.querySelectorAll(".selector"), // все селекторы
  inputPosition = document.querySelector("#input-position"),
  inputTransformValue = document.querySelector("#input-transform-value"),
  inputTransform = document.querySelector("#input-transform"),
  inputTransformX = document.querySelector("#input-transform-x"),
  inputTransformY = document.querySelector("#input-transform-y"),
  inputZindex = document.querySelector("#input-zindex"),
  inputFigure = document.querySelector("#input-figure"),
  inputLeft = document.querySelector("#input-left"),
  inputTop = document.querySelector("#input-top"),
  inputSizes = document.querySelector("#input-width-height"),
  sendBtn = document.querySelector(".send-btn"), // кнопка отправки
  inputColor = document.querySelector("#input-color"),
  clearBtn = document.querySelector(".clear-btn"), // кнопка очистки формы
  clearContainer = document.querySelector(".clear-container"), // кнопка очистки контейнера
  showWrapper = document.querySelector(".show-wrapper"); // контейнер

//Получаю DOM- объекты

let validObj = {
  sizes: 0,
  figure: 0,
  position: 0,
  transform: 0,
  transformX: 0,
}; // объект, элементы которого и их значения служат для валидации
sendBtnValid = 0;
let idNum = 0; // значение id каждого элемента
let animationBool = 0;
let loadingBool = 0; // булевое значение, которое определяет, идет загрузка или нет
let loadingValue = 0; //значение загрузки

let lineSpeed = 1; //значение скорости линии

// Функция временной линии, принимает время интервала (в миллисекундах)
let loadingFunc = (time) => {
  let loadingInterval = setInterval(() => {
    // Проверка условий для остановки загрузки или завершения загрузки
    if (loadingBool == 0 || loadingValue >= 100) {
      if (loadingValue >= 100) {
        // Если линия достигла максимума, то останавливается функция
        clearInterval(loadingInterval);
        loadingLine.style.width = "100%";
        // на всякий случай устанавливаем значение ширины 100%, чтобы избежать значений 101,102,103
        startPauseBtn.setAttribute("src", "img/start.png");
        //меняем картинку  на картинку перезагрузки
        loadingBool = 0;
        // меняем булевое значение загрузки на 0
      } else {
        clearInterval(loadingInterval);
        startPauseBtn.setAttribute("src", "img/start.png");
      }
    } else {
      startPauseBtn.setAttribute("src", "img/pause.png");
      // Увеличение значения загрузки на основе скорости линии загрузки
      loadingValue += lineSpeed;
      loadingLine.style.width = `${loadingValue}%`;
    }
  }, time);
}; //setinterval. Отвечает за загрузк

startPauseBtn.addEventListener("click", () => {
  //добавляем обработчик событий на кнопку загрузки.
  if (showWrapper.querySelector(".animation-item")) {
    if (loadingBool == 0) {
      // проверяем булевое значение загрузки
      if (animationBool) {
        loadingBool = 1;
        // если оно равно 0, то меняем его на 1 и запускаем функцию
        loadingFunc(100); // вызывается функция setinterval
        if (loadingLine.style.width == "100%") {
          // если линия уже равна 100%, то  меняем значение на 0
          loadingLine.style.width = "0";
          loadingValue = 0;
          // и присваиваем значение 0 переменной, которая хранит значение загрузки
        }
        const animItems = document.querySelectorAll(".animation-item");
        animationBool = 0;
        // получаю все анимируемые элементы на странице
        animItems.forEach((animItem) => {
          // используем метод foreach, чтобы перебрать коллекцию элементов
          const dataTransform = animItem.getAttribute("data-transform");
          const transformX = animItem.getAttribute("data-x");
          // получаем значение атрибутов, чтобы использовать их в стилизации
          if (dataTransform == "translate" || dataTransform == "skew") {
            // проверяем на то, какое значение transform у элемента
            // т.к. у translate и skew 2 параметра, а у остальных -1
            const transformY = animItem.getAttribute("data-y");
            // получаем второе значение
            let time = 10 / lineSpeed;
            // устанавливаем время transition
            animItem.style.transition = `${time}s`;
            if (dataTransform == "translate") {
              animItem.style.transform = `${dataTransform}(${transformX}px,${transformY}px)`;
            } else {
              animItem.style.transform = `${dataTransform}(${transformX}deg,${transformY}deg)`;
            }
          } else {
            if (dataTransform == "scale") {
              animItem.style.transform = `${dataTransform}(${transformX})`;
            } else {
              animItem.style.transform = `${dataTransform}(${transformX}deg)`;
            }
          }
        });
      } else {
        alert("All animations worked. Reset to repeat");
      }
    }
  } else {
    alert("here is no object to animation");
  }
});

speedLineBtn.addEventListener("click", () => {
  // кнопка, значение которой определяет скорость линии и время transition
  if (loadingBool == 0) {
    // смена значения возможна только тогда, когда не функция setinterval не вызвана
    let currentSpeed = +speedLineBtn.getAttribute("data-speed");
    // получаем значение дата атрибута
    if (currentSpeed == 3) {
      // если он равен макс значению, то делаем его минимальным
      speedLineBtn.setAttribute("data-speed", "1");
      lineSpeed = 1;
    } else {
      // иначе добавляем 0.5
      let newSpeed = +currentSpeed + 0.5;
      speedLineBtn.setAttribute("data-speed", newSpeed);
      lineSpeed = newSpeed;
    }
    const anims = document.querySelectorAll(".animation-item");
    anims.forEach((anim) => {
      //устанавливаем значение transition на все анимируемые элементы
      let animSpeed = 10 / lineSpeed;
      anim.style.transition = `${animSpeed}s`;
    });
    speedLineBtn.textContent = "x" + lineSpeed;
  }
});

const validator = () => {
  // функция валидатор, которая вызывается на событии blur всех input и select элементов формы
  if (inputTransform.value == "scale" || inputTransform.value == "rotate") {
    // валидация происходит на основе значений объекта validObj
    // значения validobj меняются в зависимости от того какие стили используются
    if (inputPosition.value == "static") {
      if (
        validObj.sizes == 1 &&
        validObj.figure == 1 &&
        validObj.position == 1 &&
        validObj.transform == 1 &&
        validObj.transformX == 1
      ) {
        sendBtn.style.backgroundColor = "rgb(124, 255, 124)";
        // если валидация проходит успешно, то background кнопки добавления элемента становится зеленой
        sendBtnValid = 1;
      } else {
        sendBtnValid = 0;
        // иначе красной
        sendBtn.style.backgroundColor = "rgb(208, 208, 208)";
      }
    } else {
      if (
        validObj.sizes == 1 &&
        validObj.figure == 1 &&
        validObj.position == 1 &&
        validObj.top == 1 &&
        validObj.left == 1 &&
        validObj.zindex == 1 &&
        validObj.transform == 1 &&
        validObj.transformX == 1
      ) {
        sendBtnValid = 1;
        sendBtn.style.backgroundColor = "rgb(124, 255, 124)";
      } else {
        sendBtnValid = 0;
        sendBtn.style.backgroundColor = "rgb(208, 208, 208)";
      }
    }
  } else {
    if (inputPosition.value == "static") {
      if (
        validObj.sizes == 1 &&
        validObj.figure == 1 &&
        validObj.position == 1 &&
        validObj.transform == 1 &&
        validObj.transformX == 1 &&
        validObj.transformY == 1
      ) {
        sendBtnValid = 1;

        sendBtn.style.backgroundColor = "rgb(124, 255, 124)";
      } else {
        sendBtnValid = 0;
        sendBtn.style.backgroundColor = "rgb(208, 208, 208)";
      }
    } else {
      if (
        validObj.sizes == 1 &&
        validObj.figure == 1 &&
        validObj.position == 1 &&
        validObj.top == 1 &&
        validObj.left == 1 &&
        validObj.zindex == 1 &&
        validObj.transform == 1 &&
        validObj.transformX == 1 &&
        validObj.transformY == 1
      ) {
        sendBtnValid = 1;
        sendBtn.style.backgroundColor = "rgb(124, 255, 124)";
      } else {
        sendBtnValid = 0;
        sendBtn.style.backgroundColor = "rgb(208, 208, 208)";
      }
    }
  }
};

const inputValidStyle = (input) => {
  if (input.value.length == 0) {
    input.classList.add("incorrect-input");
  } else {
    input.classList.add("correct-input");
  }
};
INPUTS.forEach((input) => {
  // устанавливаем красную тень  после blur на все элементы инпут, если длина их значений равна 0
  input.addEventListener("blur", () => {
    inputValidStyle(input);
  });
});

SELECTORS.forEach((selector) => {
  selector.addEventListener("blur", () => {
    if (selector.value == "null") {
      // устанавливаем красную тень после blur на все элементы selector, если значение равно Null
      selector.classList.add("incorrect-input");
    } else {
      selector.classList.add("correct-input");
    }
  });
});
inputTransform.addEventListener("blur", () => {
  if (inputTransform.value.length == 0) {
    // в зависиомости от значения конкретного элемента, меняем значение элемента объекта для валидации
    validObj.transform = 0;
  } else {
    validObj.transform = 1;
  }
  validator();
});

inputTransform.addEventListener("change", () => {
  // в зависимости от того, какое значение transform выбрано,
  //определяем сколько инпутов для трансформ будет выведено на экран и какой у них будет плейсхолдер
  if (inputTransform.value == "skew" || inputTransform.value == "translate") {
    inputTransformX.style.display = "block";
    inputTransformY.style.display = "block";

    if (inputTransform.value == "skew") {
      inputTransformX.setAttribute("placeholder", "skew:x(deg)");
      inputTransformY.setAttribute("placeholder", "skew:y(deg)");
    } else {
      inputTransformX.setAttribute("placeholder", "translate:x(px)");
      inputTransformY.setAttribute("placeholder", "translate:y(px)");
    }
  } else {
    inputTransformX.style.display = "block";
    inputTransformY.style.display = "none";
    if (!validObj.transformY) {
      validObj.transformY = 0;
      // добавляем дополнительный элемент в объект
    }
    if (inputTransform.value == "scale") {
      inputTransformX.setAttribute("placeholder", "scale:N");
    } else {
      inputTransformX.setAttribute("placeholder", "rotate:N(deg)");
    }
  }
});

inputTransformX.addEventListener("blur", () => {
  if (inputTransformX.value.length == 0) {
    validObj.transformX = 0;
  } else {
    validObj.transformX = 1;
  }
  validator();
});
inputTransformY.addEventListener("blur", () => {
  if (inputTransformY.length == 0) {
    validObj.transformY = 0;
  } else {
    validObj.transformY = 1;
  }
  validator();
});

inputPosition.addEventListener("blur", () => {
  if (inputPosition.value == "null") {
    validObj.position = 0;
  } else {
    validObj.position = 1;
  }
  validator();
});

inputTop.addEventListener("blur", () => {
  if (inputTop.value.length == 0) {
    validObj.top = 0;
  } else {
    validObj.top = 1;
  }
  validator();
});
inputTop.addEventListener("input", () => {
  if (inputTop.value > 5000) {
    inputTop.value = 5000;
  }
});

inputLeft.addEventListener("blur", () => {
  if (inputLeft.value.length == 0) {
    validObj.left = 0;
  } else {
    validObj.left = 1;
  }
  validator();
});
inputLeft.addEventListener("input", () => {
  if (inputLeft.value > 2000) {
    // устанавливаем пределы, чтобы при позиционировании блоки не улетали совсем далеко
    inputLeft.value = 2000;
  }
});

inputPosition.addEventListener("change", () => {
  // логика аналогична InputTransform
  // Если юзер выбирает Position  static,то дополнительные инпуты не появляются
  if (inputPosition.value == "static") {
    inputTop.style.display = "none";
    inputLeft.style.display = "none";
    inputZindex.style.display = "none";

    if (validObj.top && validObj.left && validObj.zindex) {
      delete validObj.zindex;
      delete validObj.top;
      delete validObj.left;
    }
  } else {
    inputTop.style.display = "block";
    inputLeft.style.display = "block";
    inputZindex.style.display = "block";
    if (validObj.top && validObj.left && validObj.zindex) {
      validObj.top = 1;
      validObj.left = 1;
      validObj.zindex = 1;
    } else {
      validObj.top = 0;
      validObj.left = 0;
      validObj.zindex = 0;
    }
  }
});
inputFigure.addEventListener("blur", () => {
  if (inputFigure.value !== "null") {
    validObj.figure = 1;
  } else {
    validObj.figure = 0;
  }
  validator();
});
inputZindex.addEventListener("input", () => {
  if (inputZindex.value > 100) {
    inputZindex.value = 100;
    // устанавливаем макимальное значение для z-index
  }
});
inputZindex.addEventListener("blur", () => {
  if (!inputZindex.value.length == 0) {
    validObj.zindex = 1;
  } else {
    validObj.zindex = 0;
  }
  validator();
});

inputSizes.addEventListener("blur", () => {
  if (inputSizes.value.length == 0) {
    validObj.sizes = 0;
  } else {
    validObj.sizes = 1;
    if (inputSizes.value > 1000) {
      inputSizes.value = 1000;
    }
  }
  validator();
});

inputSizes.addEventListener("input", () => {
  if (inputSizes.value > 1000) {
    inputSizes.value = 1000;
    // устанавливаем макимальное значение для размеров
  }
});

sendBtn.addEventListener("click", () => {
  if (sendBtnValid == 1) {
    // проверяем переменную на валидность введенных значений
    document.querySelector(".show-title").style.display = "none";
    // скрываем плавающую надпись
    idNum += 1;
    // добавляем +1 переменной, которая будет использоваться в id
    const animationItem = `
    <div class="animation-item" title="Нажми 2 раза, чтобы скопировать код" id="${
      inputFigure.value + idNum
    }" data-transform="${inputTransform.value}" >   </div> `;
    animationBool = 1;
    //создаем элемент, в качестве айди используются значение фигуры+ idNum
    showWrapper.insertAdjacentHTML("beforeend", animationItem);
    // добавляем в конец контейнера
    const animItem = document.querySelector(`#${inputFigure.value + idNum}`);
    animItem.style.transition = 10 / lineSpeed;
    animItem.setAttribute("data-x", `${inputTransformX.value}`);
    // Обращаемся к элементу и устанавливаем атрибуты
    if (inputTransform.value == "translate" || inputTransform.value == "skew") {
      animItem.setAttribute("data-y", `${inputTransformY.value}`);
      // если это элементы translate или skew, то добавляем дополнительный параметр
    }
    if (inputPosition.value !== "static") {
      // если position не равно static, добавляем дополнительные стили
      animItem.style.position = `${inputPosition.value}`;
      animItem.style.top = `${inputTop.value}px`;
      animItem.style.left = `${inputLeft.value}px`;
      animItem.style.zIndex = `${inputZindex.value}`;
    }
    if (inputFigure.value == "triangle") {
      // для построения треугольника используем border
      animItem.style.borderBottom = `${inputSizes.value + "px"} solid ${
        inputColor.value
      } `;
      animItem.style.borderRight = ` ${
        inputSizes.value / 2 + "px"
      } solid transparent`;
      animItem.style.borderLeft = ` ${
        inputSizes.value / 2 + "px"
      } solid transparent`;
    } else {
      animItem.style.width = `${inputSizes.value}px`;
      animItem.style.height = `${inputSizes.value}px`;
      animItem.style.backgroundColor = `${inputColor.value}`;
      // а круг и квадрат по стандарту
      if (inputFigure.value == "circle") {
        // кругу добавляем стили для округления
        animItem.style.borderRadius = "50%";
      }
    }
  } else {
    // если значения не валидны, то пробегаемся по всем элементам, чтобы все невалидные значения подкрасить красным
    INPUTS.forEach((input) => {
      inputValidStyle(input);
    });
    SELECTORS.forEach((selector) => {
      if (selector.value == "null") {
        selector.classList.add("incorrect-input");
      } else {
        selector.classList.add("correct-input");
      }
    });
    alert("Невалидные значения");
  }
});

clearBtn.addEventListener("click", () => {
  INPUTS.forEach((input) => {
    input.value = "";
  });
  SELECTORS.forEach((selector) => {
    selector.value = "null";
  });
  // обнуляем все значения формы
});
clearContainer.addEventListener("click", () => {
  showWrapper.innerHTML = "";
  loadingBool = 0;
  loadingValue = 0;
  document.querySelector(".show-title").style.display = "block";
  // очищаем весь контейнер и возвращаем плавающую надпись
});
animationReset.addEventListener("click", () => {
  // кнопка reset возвращает все анимированные элементы в исходную позицию, позволяя их анимировать повторно
  loadingValue = 0;
  loadingBool = 0;
  animationBool = 1;
  loadingLine.style.width = 0;
  const anims = document.querySelectorAll(".animation-item");
  anims.forEach((anim) => {
    anim.style.transform = "none";
  });
});

const copyFunc = (value) => {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  // добавляем временный элемент textarea на страницу
  document.body.appendChild(textarea);
  // выделяем текст внутри textarea
  textarea.select();
  // копируем выделенный текст в буфер обмена
  document.execCommand("copy");
  // удаляем временный  textarea
  document.body.removeChild(textarea);
};

body.addEventListener("dblclick", (e) => {
  // устанавливаем событие на двойной клик
  targetAnim = e.target;
  let cssCode;
  if (targetAnim.classList.contains("animation-item")) {
    // если клик пришелся на анимируемый объект, то ...
    const dataTransform = targetAnim.getAttribute("data-transform");
    const X = targetAnim.getAttribute("data-x");
    if (dataTransform == "translate" || dataTransform == "skew") {
      const Y = targetAnim.getAttribute("data-y");
      if (dataTransform == "translate") {
        cssCode = `transform: translate(${X}px, ${Y}px);`;
      } else if (dataTransform == "skew") {
        console.log("skew");
        cssCode = `transform: skew(${X}deg, ${Y}deg);`;
      }
    } else {
      if (dataTransform == "scale") {
        cssCode = `transform: scale(${X});`;
      } else if (dataTransform == "rotate") {
        cssCode = `transform: rotate(${X}deg);`;
      }
    }
    console.log(cssCode);
    //... копируем код для анимации в буфер обмена
    copyFunc(cssCode);
    alert("Скопировано");
  } else {
    console.log("dsa");
  }
});
