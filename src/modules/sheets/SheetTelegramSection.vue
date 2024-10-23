<script setup lang="ts"></script>

<template>
  <section
    class="telegramContainer fixed z-50 bottom-8 right-8 cursor-pointer border-3 border-solid border-white rounded-full transition-all duration-300"
  >
    <p
      class="telegramText absolute w-96 h-20 p-4 text-white font-medium bg-black bg-opacity-70 rounded-full transition-all duration-300 pointer-events-none"
    >
      Хотите написать жалобу, есть пожелания или вопросы? Напишите нам!
    </p>
    <a href="https://t.me/shelfNoteBot" target="_blank">
      <div
        class="size-14 rounded-full"
        style="
          background-image: url('/Telegram.png');
          background-size: contain;
          background-color: white;
        "
      ></div>
    </a>
  </section>
</template>

<style scoped>
.telegramContainer > .telegramText {
  opacity: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.telegramContainer:hover > .telegramText {
  opacity: 100;
  right: 104%;
}
.telegramContainer:hover > a {
  filter: brightness(0.75);
}
</style>
