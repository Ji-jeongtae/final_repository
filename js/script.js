// Recycling 인터랙션 스크립트

document.addEventListener("DOMContentLoaded", () => {
  const trashEls = Array.from(document.querySelectorAll(".trash"));
  const gameMsg = document.getElementById("gameMessage");
  const oceanTrashEls = Array.from(document.querySelectorAll(".ocean-trash"));

  let removedCount = 0;
  const totalCount = trashEls.length;

  // 쓰레기 클릭 → 아래로 떨어지기 + 바다에 나타나기
  trashEls.forEach((el) => {
    el.addEventListener("click", () => {
      if (el.classList.contains("fall")) return; // 이미 떨어진 애는 무시

      el.classList.add("fall");
      removedCount += 1;

      // 같은 data-type 가진 바다 쓰레기 진하게 표시
      const type = el.dataset.type;
      oceanTrashEls
        .filter((t) => t.dataset.type === type)
        .forEach((t) => t.classList.add("active"));

      // 모든 쓰레기를 떨어뜨렸으면 GAME OVER 메시지 표시
      if (removedCount >= totalCount) {
        gameMsg.style.opacity = "1";
      }
    });

    // hover 들어갈 때마다 약간 위치 랜덤 변경해서 '도망가는' 느낌 추가
    el.addEventListener("mouseenter", () => {
      if (el.classList.contains("fall")) return;
      const deltaX = (Math.random() - 0.5) * 60; // -30 ~ 30
      const deltaY = -20 - Math.random() * 20; // -20 ~ -40
      el.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(3deg)`;
    });

    // 마우스가 떠나면 transform 다시 초기화(transition으로 자연스럽게 원위치)
    el.addEventListener("mouseleave", () => {
      if (el.classList.contains("fall")) return;
      el.style.transform = "translate(0, 0)";
    });
  });
});
