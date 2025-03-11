<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="userData.username" placeholder="Username" required />
      <input v-model="userData.email" type="email" placeholder="Email" required />
      <input v-model="userData.password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>

    <button class="login-button" @click="goToLogin">Already have an account? Login</button>

    <!-- Modal de registro exitoso -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        <h3>Registration Successful!</h3>
        <p>Please login to continue.</p>
        <button @click="goToLogin">Go to Login</button>
      </div>
    </div>

    <!-- Modal de registro fallido -->
    <div v-if="showErrorModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">X</button>
        <h3>Registration Failed</h3>
        <p>Please try again.</p>
        <button @click="showErrorModal = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: {
        username: '',
        email: '',
        password: '',
      },
      showSuccessModal: false,
      showErrorModal: false,
    };
  },
  methods: {
    async handleRegister() {
      try {
        await this.$store.dispatch('auth/register', this.userData);
        this.showSuccessModal = true;
      } catch (error) {
        this.showErrorModal = true;
      }
    },
    goToLogin() {
      this.$router.push('/login');
    },
    closeModal() {
      this.showSuccessModal = false;
      this.showErrorModal = false;
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.login-button {
  margin-top: 10px;
  background-color: #28a745;
}

.login-button:hover {
  background-color: #218838;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 80%;
  max-width: 400px;
  position: relative;
}

/* Botón de cierre */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
</style>
