<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const menuIsOpen = ref(false);

const navItems = [
  { title: 'KulturBooking',
    type: 'external',
    href: 'https://kulturbooking.dk' },
  { title: 'Om os',
    type: 'anchor',
    href: '#about' },
];

function toggleMenu() {
  menuIsOpen.value = !menuIsOpen.value;
}

function closeMenu() {
  menuIsOpen.value = false;
}
</script>

<template>
    <header class="header">
      <RouterLink to="/" class="logo" @click="closeMenu">
        <img src="@/assets/kb_logo.png" alt="KulturBooking" />
      </RouterLink>

      <button
        class="burger-button"
        @click="toggleMenu"
        :aria-expanded="menuIsOpen"
        aria-label="Toggle navigation menu"
        >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="navigation" :class="{ 'navigation--open': menuIsOpen }">
            
        <ul>
        <li
            v-for="item in navItems"
            :key="item.title"
        >
            <!-- Internal section anchor -->
            <a
            v-if="item.type === 'anchor'"
            :href="item.href"
            @click="closeMenu"
            >
            {{ item.title }}
            </a>

            <!-- Vue Router link -->
            <RouterLink
            v-else-if="item.type === 'route'"
            :to="item.href"
            @click="closeMenu"
            >
            {{ item.title }}
            </RouterLink>

            <!-- External link -->
            <a
            v-else
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu"
            >
            {{ item.title }}
            </a>

        </li>
        </ul>

      </nav>
    </header>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 80px;
  padding: 5%;
  position: relative;
  background-color: $background-color;
}

// Mobile-first: Burger menu
.burger-button {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;

  span {
    width: 25px;
    height: 2px;
    background-color: currentColor;
  }
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: inherit;
    img {
        width: 60px;
        height: auto;
    }
}

.burger-button {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;

  span {
    display: block;
    width: 25px;
    height: 2px;
    background-color: currentColor;
    transition: 0.3s ease;
  }
}

.navigation {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  background-color: $background-color;
  z-index: 10;

  ul {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  &.navigation--open {
    display: block;
  }
}

.cta-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: $cta-color;
  color: $hero-text-color;
  border-radius: 8px;
  text-decoration: none;
}


// Mobile-first: Burger menu
.burger-button {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;

  span {
    width: 25px;
    height: 2px;
    background-color: currentColor;
  }
}

.navigation {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 1.5rem;
  background-color: #fff;
  z-index: 10;

  ul {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &.navigation--open {
    display: block;
  }
}

@media (min-width: 576px) {
    .header {
      max-height: 100px;  
    }
    .logo {
      img {
        width: 80px;
      }
    }
}

@media (min-width: 768px) {
  .burger-button {
    display: none;
  }

  .navigation {
    display: block;
    position: static;
    width: auto;
    padding: 0;
    background: transparent;

    ul {
      flex-direction: row;
      align-items: center;
      gap: 2rem;
    }
  }
}
</style>