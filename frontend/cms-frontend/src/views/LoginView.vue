<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Welcome!</h2>
      <p>Sign in or create an account to continue</p>

      <form @submit.prevent="handleAuth">
        <div class="input-group">
          <input
            type="text"
            v-model="username"
            placeholder="Enter your username"
            required
            @blur="checkUserOnBlur"
          />
        </div>

        <div class="input-group">
          <input type="password" v-model="password" placeholder="Enter your password" required />
        </div>

        <button type="submit">{{ buttonText }}</button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <div class="extra-links">
        <a href="#">Forgot password?</a>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser, signupUser, checkUserExists, getUserProfile } from "@/api";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      username: "",
      password: "",
      isExistingUser: null,
      errorMessage: "",
    };
  },
  computed: {
    buttonText() {
      if (this.isExistingUser === null) return "Continue";
      return this.isExistingUser ? "Login" : "Sign Up";
    },
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async checkUserOnBlur() {
      if (!this.username) {
        this.isExistingUser = false;
        return;
      }
      try {
        const response = await checkUserExists(this.username);
        this.isExistingUser = response.exists;
      } catch (error) {
        console.error("Error checking user:", error);
        this.isExistingUser = false;
      }
    },

    async handleAuth() {
      this.errorMessage = "";

      if (!this.username) {
        this.errorMessage = "Please enter a username.";
        return;
      }

      if (this.isExistingUser === null) {
        await this.checkUserOnBlur();
      }

      if (this.isExistingUser) {
        await this.login();
      } else {
        await this.signup();
      }
    },

    async login() {
      try {
        const response = await loginUser(this.username, this.password);
        if (response.token) {
          localStorage.setItem("access_token", response.token);
          await this.fetchUserProfile();
        } else {
          this.errorMessage = "Invalid credentials. Please try again.";
        }
      } catch (error) {
        this.errorMessage = "Invalid credentials. Please try again.";
      }
    },

    async signup() {
      try {
        const response = await signupUser(this.username, this.password);
        if (response.success) {
          localStorage.setItem("access_token", response.token);
          await this.fetchUserProfile();
        } else {
          this.errorMessage = "Signup failed. Please try again.";
        }
      } catch (error) {
        this.errorMessage = "Signup failed. Please try again.";
      }
    },

    async fetchUserProfile() {
      try {
        const response = await getUserProfile();
        if (response.username) {
          localStorage.setItem("username", response.username);
          this.router.replace("/dashboard");
        } else {
          this.errorMessage = "Error retrieving user profile.";
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    },
  },
};
</script>


<style>
/* Existing styles remain unchanged */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ff9966, #ff5e62);
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.auth-box h2 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.auth-box p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #ff5e62;
  outline: none;
}

button {
  width: 100%;
  background: #ff5e62;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #ff3b44;
}

.extra-links {
  margin-top: 15px;
}

.extra-links a {
  color: #ff5e62;
  text-decoration: none;
  font-size: 14px;
}

.extra-links a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
