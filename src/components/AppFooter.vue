<template>
  <footer class="footer">
    <div class="footer-content">
      <a href="https://kulturbooking.dk/about">Om KulturBooking</a>
      <a href="https://kulturbooking.dk/contact">Kontakt os</a>
      <a href="https://kulturbooking.dk/privacy">Privatlivspolitik</a>
      <a href="https://kulturbooking.dk/terms">Servicevilkår</a>
      <a href="https://kulturbooking.dk/data-safety">Data & sikkerhed</a>
      <p>© 2025 KulturBooking</p>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use "@/assets/variables" as *;

.footer {
  padding: 2rem 5%;
  text-align: center;
  background-color: $hero-text-color;
  p {
    color: $background-color;
  }
}

.footer-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  a {
    color: $background-color;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (min-width: 768px) {

    .footer-content {
        justify-content: space-between;
        max-width: 800px;
        margin: 0 auto;
    }
}
</style>