document.addEventListener("DOMContentLoaded", () => {
  const trashes = document.querySelectorAll(".trash");
  const gameMessage = document.getElementById("gameMessage"); // 💡 바다 섹션 관련 변수 (GAME OVER 이후 스크롤 액션에 사용)
  const oceanSection = document.querySelector(".screen-ocean");
  const oceanTrashes = document.querySelectorAll(".ocean-trash");
  const oceanObjs = document.querySelectorAll(".ocean-obj"); // 💡 메시지 단계 관리를 위한 변수 // 0: fishbone 클릭 전, 1: M1 표시됨, 2: M2 표시됨, 3: M3 표시됨

  let trashClickPhase = 0;
  let remaining = trashes.length;
  let gameOver = false; // fishbone 개별 요소 및 텍스트 요소 가져오기

  const fishboneImg = document.getElementById("fishboneImg");
  const clickText = document.getElementById("clickText");
  const nextTrashMessage = document.getElementById("nextTrashMessage"); // "다음 쓰레기는요?"

  const trashArea = document.getElementById("trashArea"); // 1단계 메시지: "계속 하실건가요?" (동적 생성)

  const continueMessage = document.createElement("span");
  continueMessage.classList.add("next-trash-message-absolute");
  continueMessage.id = "continueMessage";
  continueMessage.textContent = "계속 하실건가요?";
  continueMessage.style.display = "none";
  trashArea.appendChild(continueMessage); // 2단계 메시지: "그렇다면 다 떨어뜨려봅시다!" (동적 생성)

  const finalMessage = document.createElement("span");
  finalMessage.classList.add("next-trash-message-absolute");
  finalMessage.id = "finalMessage";
  finalMessage.textContent = "그렇다면 다 떨어뜨려봅시다!";
  finalMessage.style.display = "none";
  trashArea.appendChild(finalMessage);

  trashes.forEach((trash) => {
    // 클릭 이벤트 리스너
    trash.addEventListener("click", () => {
      if (
        trash.classList.contains("fall") ||
        trash.classList.contains("fall-paper")
      )
        return; // 💡 클릭 시점의 페이즈를 저장 (onEnd에서 어떤 메시지를 띄울지 결정)

      const phaseAtClick = trashClickPhase; // 💡 getComputedStyle을 사용하여 CSS에 정의된 최종 위치를 가져옵니다.

      const trashComputedStyle = window.getComputedStyle(trash);

      const fallenTrashLocation = {
        top: trashComputedStyle.top,
        left: trashComputedStyle.left,
      }; // ---------------------------------------------------------------------- // 1. 클릭 시 현재 떠 있는 메시지 즉시 숨기기

      if (phaseAtClick === 1 && trash.id !== "fishboneImg") {
        nextTrashMessage.style.display = "none";
      } else if (phaseAtClick === 2 && trash.id !== "fishboneImg") {
        continueMessage.style.display = "none";
      } else if (phaseAtClick === 3 && trash.id !== "fishboneImg") {
        finalMessage.style.display = "none";
      } // ---------------------------------------------------------------------- // fishbone 클릭 처리 로직 (첫 클릭)
      if (trash.id === "fishboneImg" && phaseAtClick === 0) {
        // "Click!" 텍스트 제거 및 깜빡임 중지
        if (clickText) {
          clickText.style.display = "none";
          clickText.style.animation = "none";
        }
        trash.classList.remove("blink");
      } else if (trash.id === "fishboneImg" && phaseAtClick > 0) {
        return;
      } // ----------------------------------------------------------------------
      trash.style.animation = "none";
      trash.style.pointerEvents = "none";
      trash.style.transition = "none"; // 종이 쓰레기인지 확인 및 애니메이션 클래스 추가

      const isPaper =
        trash.classList.contains("trash-a4") ||
        trash.classList.contains("trash-biga4");

      if (isPaper) {
        trash.classList.add("fall-paper");
      } else {
        trash.classList.add("fall");
      } // 쓰레기 떨어짐 애니메이션 종료 시점

      const onEnd = () => {
        trash.removeEventListener("animationend", onEnd);
        trash.remove();
        remaining--; // 2. 애니메이션 종료 후 단계별 메시지 표시 및 Phase 업데이트

        if (phaseAtClick === 0 && trash.id === "fishboneImg") {
          // fishbone 클릭 후 (Phase 0 -> Phase 1)
          nextTrashMessage.style.display = "block";
          trashClickPhase = 1;
        } else if (phaseAtClick === 1) {
          // 첫 랜덤 쓰레기 클릭 후 (Phase 1 -> Phase 2)
          continueMessage.style.top = fallenTrashLocation.top;
          continueMessage.style.left = fallenTrashLocation.left;
          continueMessage.style.transform = "translate(-50%, -50%)";
          continueMessage.style.display = "block";
          trashClickPhase = 2;
        } else if (phaseAtClick === 2) {
          // 두 번째 랜덤 쓰레기 클릭 후 (Phase 2 -> Phase 3)
          finalMessage.style.top = fallenTrashLocation.top;
          finalMessage.style.left = fallenTrashLocation.left;
          finalMessage.style.transform = "translate(-50%, -50%)";
          finalMessage.style.display = "block";
          trashClickPhase = 3;
        } else if (phaseAtClick === 3) {
          // 세 번째 랜덤 쓰레기 클릭 후 (Phase 3 -> Phase 4)
          trashClickPhase = 4;
        }

        if (remaining === 0) {
          showGameOver(); // 💡 GAME OVER 실행
        }
      };

      trash.addEventListener("animationend", onEnd);
    });
  }); // ===== 2. GAME OVER 메시지 표시 =====
  function showGameOver() {
    gameOver = true; // 화면 어둡게 만들기

    const topSection = document.querySelector(".screen-top");
    topSection.classList.add("dimmed");

    if (gameMessage) {
      gameMessage.classList.add("show");
    }
  }
  // ===== 3. 스크롤 시 바다 섹션 최종 메시지 출력 =====

  const oceanObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && gameOver) {
          showOceanContent();
          oceanObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (oceanSection) {
    oceanObserver.observe(oceanSection);
  }

  function showOceanContent() {
    const finalMessageLine1 = document.getElementById("finalMessageLine1");
    const finalMessageLine2 = document.getElementById("finalMessageLine2");
    const kobaImage = document.getElementById("kobaImage"); // 바다 섹션에 클래스 추가
    oceanSection.classList.add("ocean-visible"); // 기존 바다 쓰레기 및 오브젝트 등장 애니메이션

    oceanTrashes.forEach((trash, index) => {
      setTimeout(() => {
        trash.classList.add("appear");
      }, 300 + index * 150);
    });

    oceanObjs.forEach((obj, index) => {
      setTimeout(() => {
        obj.style.opacity = "1";
      }, 800 + index * 200);
    }); // 💡 최종 메시지 및 koba 이미지 등장 로직

    const line1Text = "쓰레기를 떨어뜨리며 어디로 가는지, 생각해 보셨나요?";
    const line2Text = "당신의 작은 관심이 지구를 살립니다";

    let delay = 6000; // 바다 오브젝트 등장 후 2초 대기 // 첫 번째 메시지 한 글자씩 나타나기

    setTimeout(() => {
      if (finalMessageLine1) finalMessageLine1.style.opacity = "1";
      if (finalMessageLine1) typeWriter(finalMessageLine1, line1Text, 70);
    }, delay);

    delay += line1Text.length * 70 + 4000; // 첫 번째 줄 완료 후 1초 대기 // 두 번째 메시지 한 글자씩 나타나기

    setTimeout(() => {
      if (finalMessageLine2) finalMessageLine2.style.opacity = "1";
      if (finalMessageLine2) typeWriter(finalMessageLine2, line2Text, 70);
    }, delay);

    delay += line2Text.length * 70 + 2500; // 두 번째 줄 완료 후 1.5초 대기 // koba 이미지 은은하게 나타나기

    setTimeout(() => {
      if (kobaImage) kobaImage.style.opacity = "1";
    }, delay);
  } // 💡 한 글자씩 텍스트를 타이핑하는 효과 함수

  function typeWriter(element, text, delayPerChar) {
    let i = 0;
    element.innerHTML = ""; // 기존 텍스트 초기화
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, delayPerChar);
      }
    }
    type();
  }
});
