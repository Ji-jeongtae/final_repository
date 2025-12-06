document.addEventListener("DOMContentLoaded", () => {
  const trashList = document.querySelectorAll(".trash");
  const gameMessage = document.getElementById("gameMessage");
  const oceanTrash = document.querySelectorAll(".ocean-trash");
  const oceanInner = document.querySelector(".ocean-inner");

  const totalTrash = trashList.length;
  let fallCount = 0;

  // 상단 쓰레기 둥둥 모션의 시작 타이밍을 조금씩 랜덤으로 다르게
  trashList.forEach((item) => {
    const delay = Math.random() * 3; // 0~3초
    item.style.animationDelay = `${delay}s`;
  });

  // 쓰레기 hover → 더 빠르게 도망
  trashList.forEach((item) => {
    // 마우스 올렸을 때 도망
    item.addEventListener("mouseenter", () => {
      if (item.classList.contains("fall")) return; // 이미 떨어진 애는 무시

      const dx = (Math.random() * 240 - 120).toFixed(0); // -120 ~ 120px
      const dy = (Math.random() * 140 - 70).toFixed(0); // -70 ~ 70px
      const rotate = (Math.random() * 50 - 25).toFixed(0);

      // CSS animation 위에 덮어쓰기
      item.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;
    });

    // 마우스가 나가면 다시 둥둥 상태로 복귀
    item.addEventListener("mouseleave", () => {
      if (item.classList.contains("fall")) return;
      item.style.transform = "";
    });

    // 클릭 → 아래로 떨어지기
    item.addEventListener("click", () => {
      if (item.classList.contains("fall")) return;

      item.classList.add("fall");
      fallCount += 1;

      // 전부 떨어뜨렸을 때
      if (fallCount === totalTrash) {
        showGameOver();
        revealOceanScene(); // 파도 + 물고기 + 거북이
        revealOceanTrash(); // 바다 쓰레기
      }
    });
  });

  // GAME OVER 연출
  function showGameOver() {
    if (!gameMessage) return;
    gameMessage.classList.add("show");
  }

  // 바다 전체(파도, 물고기, 거북이) 등장
  function revealOceanScene() {
    if (!oceanInner) return;
    oceanInner.classList.add("ocean-visible");
  }

  // 바다 속 쓰레기 등장
  function revealOceanTrash() {
    oceanTrash.forEach((t) => {
      t.classList.add("appear");
    });
  }
});
