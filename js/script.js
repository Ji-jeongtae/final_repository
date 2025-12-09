document.addEventListener("DOMContentLoaded", () => {
  const trashes = document.querySelectorAll(".trash");
  const gameMessage = document.getElementById("gameMessage");
  const oceanSection = document.querySelector(".screen-ocean");
  const oceanTrashes = document.querySelectorAll(".ocean-trash");
  const oceanObjs = document.querySelectorAll(".ocean-obj");

  let remaining = trashes.length;
  let gameOver = false;

  // ===== 1. 쓰레기가 마우스를 피해 도망가는 효과 =====
  trashes.forEach((trash) => {
    const moveAway = (e) => {
      if (trash.classList.contains("fall")) return;

      const rect = trash.getBoundingClientRect();
      const trashCenterX = rect.left + rect.width / 2;
      const trashCenterY = rect.top + rect.height / 2;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const distanceX = trashCenterX - mouseX;
      const distanceY = trashCenterY - mouseY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // 마우스가 150px 이내로 접근하면 도망
      if (distance < 150) {
        const angle = Math.atan2(distanceY, distanceX);
        const moveDistance = 80;
        const newX = Math.cos(angle) * moveDistance;
        const newY = Math.sin(angle) * moveDistance;

        // 현재 transform 값 가져오기
        const currentTransform = trash.style.transform || "";
        const translateMatch = currentTransform.match(
          /translate\(([^,]+),\s*([^)]+)\)/
        );

        let currentX = 0;
        let currentY = 0;
        if (translateMatch) {
          currentX = parseFloat(translateMatch[1]) || 0;
          currentY = parseFloat(translateMatch[2]) || 0;
        }

        trash.style.transform = `translate(${currentX + newX}px, ${
          currentY + newY
        }px)`;
        trash.style.transition = "transform 0.3s ease-out";
      }
    };

    document.addEventListener("mousemove", moveAway);

    // ===== 쓰레기 클릭 시 떨어지는 효과 =====
    trash.addEventListener("click", () => {
      if (trash.classList.contains("fall")) return;

      // 클릭하면 즉시 애니메이션 제거하고 떨어뜨리기
      trash.style.animation = "none";
      trash.style.pointerEvents = "none";
      trash.style.transition = "none";
      trash.classList.add("fall");

      const onEnd = () => {
        trash.removeEventListener("animationend", onEnd);
        trash.remove();
        remaining--;

        if (remaining === 0) {
          showGameOver();
        }
      };
      trash.addEventListener("animationend", onEnd);
    });
  });

  // ===== 2. GAME OVER 메시지 표시 (자동 스크롤 제거) =====
  function showGameOver() {
    gameOver = true;

    // 화면 어둡게 만들기
    const topSection = document.querySelector(".screen-top");
    topSection.classList.add("dimmed");

    if (gameMessage) {
      gameMessage.classList.add("show");
    }
  }

  // ===== 3. 스크롤 시 바다 섹션 "It's Not Over" 연출 =====
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
    // 바다 섹션에 클래스 추가
    oceanSection.classList.add("ocean-visible");

    // 바다 쓰레기들 순차적으로 등장
    oceanTrashes.forEach((trash, index) => {
      setTimeout(() => {
        trash.classList.add("appear");
      }, 300 + index * 150);
    });

    // 물고기와 거북이도 등장
    oceanObjs.forEach((obj, index) => {
      setTimeout(() => {
        obj.style.opacity = "1";
      }, 800 + index * 200);
    });
  }
});
