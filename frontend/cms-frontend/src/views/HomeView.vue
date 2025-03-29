<template>
  <div class="blogger-homepage">
    <!-- Header Section -->
    <div class="hm">
      <header class="header" :class="{ 'scrolled': isScrolled }">
        <nav class="nav-container">
          <div class="logo-section">
            <a href="#" class="logo">blooog</a>
          </div>
          <div class="nav-links">
            <transition name="slide-fade">
              <button v-if="isScrolled"  class="create-post-btn" @click="redirectToLogin">Create Blog</button>
            </transition>
            <button class="sign-in-btn"  @click="$router.push('/login')">Sign In/Sign Up</button>

          </div>
        </nav>
      </header>

      <!-- Hero Section -->

      <section class="hero-section">
        <div class="hero-content">
          <h1 class="main-heading">Publish your passions, your way</h1>
          <p class="sub-heading">Create a unique and beautiful blog easily.</p>
          <button class="cta-button" @click="redirectToLogin">CREATE YOUR BLOG</button>
        </div>
      </section>
    </div>

    <!-- Additional Sections -->

    <div class="infoDiv1">
      <section class="info-section">
        <h2 class="info-heading">Choose the perfect design</h2>
        <p class="info-description">Create a beautiful blog that fits your style. Choose from a selection of easy-to-use
          templates.</p>
      </section>
    </div>

    <div class="infoDiv2">
      <section class="info-section">
        <h2 class="info-heading">Get a domain</h2>
        <p class="info-description">Give your blog the perfect home. Get a blogspot.com domain or buy a custom domain in
          just a few clicks.</p>
      </section>
    </div>

    <div class="infoDiv4">
      <section class="info-section">
        <h2 class="info-heading">Know your audience</h2>
        <p class="info-description">Find out which posts are a hit with Blogger's built-in analytics to understand your
          audience better.</p>
      </section>
    </div>

    <div class="infoDiv5">
      <section class="info-section">
        <h2 class="info-heading">Hang onto your memories</h2>
        <p class="info-description">Save the moments that matter. Blogger lets you store thousands of posts and photos
          securely.</p>
      </section>
    </div>

    <div class="infoDiv6">
      <section class="info-section">
        <h2 class="info-heading">Join millions of others</h2>
        <p class="info-description">Whether sharing expertise or breaking news, you’re in good company on Blogger.</p>
        <button class="cta-button" @click="redirectToLogin">CREATE YOUR BLOG</button>
      </section>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'BloggerHomepage',
  data() {
    return {
      isScrolled: false,
    };
  },
  setup() {
    const router = useRouter();
    
    function handleAuth() {
      router.push('/login'); // Redirect to Login Page
    }

    return { handleAuth };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 0;
    },
    redirectToLogin() {
      this.$router.push('/login'); // Redirects to Login Page
    }
  }
};

</script>




<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

/* Header Styles */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: transparent !important;
  /* Completely transparent */
  box-shadow: none !important;
  z-index: 1000;
  transition: all 0.3s ease;
}

.header.scrolled {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  color: #ff5722;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.create-post-btn {
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: absolute;
  right: 100%;
  opacity: 0;
}

.header.scrolled .create-post-btn {
  opacity: 1;
  position: static;
}

.sign-in-btn {
  color: black;
  background-color: transparent;
  border: 1px solid #000000;
  padding: 0.8rem 1.5rem;
  border-radius: 7px;
  cursor: pointer;
  transition: margin-left 0.3s ease;
}

.header.scrolled .sign-in-btn {
  margin-left: 1.5rem;
  background-color: transparent !important;
  /* Keep it transparent even when scrolling */
  backdrop-filter: none !important;
}


.main-heading {
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  line-height: 1.2;
}

.sub-heading {
  font-size: 1.3rem;
  color: #ffffff;
  margin-bottom: 2.5rem;
}

.cta-button {
  width: 300px;
  background-color: #ff5722;
  color: white;
  border: none;
  padding: 1.2rem 2.8rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
}

/* Info Section Styles */
.info-section {
  /* background-color: #f7f7f7; */
  padding: 40px 20px;
  text-align: center;
}

.info-heading {
  font-size: 2rem;
  color: #000000;
  margin-bottom: 1rem;
}

.info-description {
  font-size: 1rem;
  color: #000000;
  margin: 0 0 2rem;
}


/* Hero Section */
.hero-section {
  display: grid;
  /* align-items: center; */
  text-align: center;
  padding: 120px 20px 60px;
  margin-top: 70px;
  height: 100vh;
}

.infoDiv1 {
  display: grid;
  height: 50vh;
}

.infoDiv1>section>p {
  text-align: right;
}

.infoDiv1>section>h2 {
  text-align: right;
}



.hm {
  min-height: 100vh;
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.infoDiv1 {
  padding-top: 10%;
  min-height: 70vh;
  background-image: url('@/assets/bg2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.infoDiv2 {
  padding-top: 10%;
  min-height: 70vh;
  background-image: url('@/assets/bg3.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.infoDiv4 {
  padding-top: 10%;
  min-height: 70vh;
  background-image: url('@/assets/bg4.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.infoDiv5 {
  padding-top: 10%;
  min-height: 70vh;
  background-image: url('@/assets/bg5.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.infoDiv6 {
  padding-top: 10%;
  min-height: 70vh;
  background-image: url('@/assets/bg6.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}



.infoDiv2 {
  display: grid;
  height: 50vh;
}

.infoDiv2>section>p {
  text-align: left;
}

.infoDiv2>section>h2 {
  text-align: left;
}


.infoDiv4 {
  display: grid;
  height: 50vh;
}

.infoDiv4>section>p {
  text-align: right;
}

.infoDiv4>section>h2 {
  text-align: right;
}



.infoDiv5 {
  display: grid;
  height: 50vh;
}

.infoDiv5>section>p {
  text-align: left;
}

.infoDiv5>section>h2 {
  text-align: left;
}



@media (max-width: 768px) {
  .hero-section {
    padding: 100px 20px 40px;
  }

  .main-heading {
    font-size: 2rem;
  }

  .sub-heading {
    font-size: 1.1rem;
  }

  .nav-container {
    padding: 1rem;
  }

  .info-heading {
    font-size: 1.5rem;
  }
}
</style>