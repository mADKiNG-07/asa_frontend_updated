<script setup>
import { RouterLink, RouterView } from "vue-router";
import Lesson from "./components/Lessons.vue"; // Import the Lesson component
import Checkout from "./components/Checkout.vue"; // Import the Checkout component
</script>

<template>
  <div id="app" class="container-fluid mt-3">
    <header>
      <div
        class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top"
        style="margin: 0"
      >
        <div class="col">
          <h2 class="navbar-brand">{{ sitename }}</h2>
        </div>
        <div class="d-flex">
          <div class="col-sm p-2">
            <input
              type="text"
              class="form-control"
              v-model="searchInput"
              placeholder="Search"
            />
          </div>
          <div class="col-sm p-2">
            <button
              class="btn btn-primary text-white"
              v-on:click="showCheckout"
              :disabled="!canUpdateToCart(Lesson)"
            >
              {{ cartItemCount }}
              <span class="fas fa-shopping-cart"></span>Checkout
            </button>
          </div>
        </div>
      </div>
    </header>
    <main>
      <br />
      <br />
      <br />
      <br />
      <!-- test -->
      <div class="d-flex">
        <!--  -->
        <div>
          <strong class="test-elem">HTTPS Test: </strong>
          <a v-bind:href="serverURL" target="_blank">link</a>
        </div>
        <!--  -->
        <div>
          <button @click="deleteAllCaches" class="test-elem">
            <span class="fas fa-trash"></span>
            Delete All Caches
          </button>
        </div>
        <!--  -->
        <div>
          <button @click="unregisterAllServiceWorkers" class="test-elem">
            <span class="fab fa-uniregistry"></span>
            Unregister All ServiceWorkers
          </button>
        </div>
        <!--  -->
        <button @click="reloadPage" class="test-elem">
          <span class="fas fa-sync"></span>
          Reload Page
        </button>
      </div>
      <div v-if="showLesson" class="container-fluid p-5">
        <!-- Lesson page -->
        <Lesson
          :lessons="filteredAndSortedLessons"
          :getLessonImageUrl="getLessonImageUrl"
          :cartCount="cartCount"
          :canAddToCart="canAddToCart"
          :sortData="sortData"
          :sortDataDesc="sortDataDesc"
          @sort-by-change="updateSortBy"
          @add-item-to-cart="addToCart"
        />
      </div>
      <div v-else class="container p-5">
        <!-- CheckOut Page -->
        <Checkout
          :sortedCart="sortedCart"
          :goToHome="goToHome"
          :getLessonImageUrl="getLessonImageUrl"
          @remove-item-from-cart="removeFromCart"
          :order="order"
          :submitForm="submitForm"
        />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  components: {
    Lesson, // Register the Lesson component
    Checkout, // Register the Checkout component
  },
  data() {
    return {
      sitename: "After School Activities",
      serverURL: "https://asa-backend.onrender.com",
      searchInput: "",
      showLesson: true, // Initial state, modify as needed
      sortBy: "default", // Initial state, modify as needed
      ascending: true, // Initial state, modify as needed
      Lessons: [], // Your lessons array
      Lesson: {}, // Your single lesson object
      cart: [],
      order: {
        FullName: "",
        PhoneNumber: "",
        isNameValid: true,
        isPhoneValid: true,
      },
    };
  },
  computed: {
    cartItemCount() {
      return this.cart.length || "";
    },
    sortedCart() {
      return this.cart;
    },
    filteredAndSortedLessons() {
      // Update this based on your existing computed property
      return this.Lessons.filter((Lessons) => {
        return (
          Lessons.subject
            .toLowerCase()
            .includes(this.searchInput.toLowerCase()) ||
          Lessons.location
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        );
      }).sort((a, b) => {
        if (this.sortBy == "Subject") {
          if (this.ascending) {
            return a.subject.localeCompare(b.subject);
          } else {
            return b.subject.localeCompare(a.subject);
          }
        } else if (this.sortBy == "Location") {
          if (this.ascending) {
            return a.location.localeCompare(b.location);
          } else {
            return b.location.localeCompare(a.location);
          }
        } else if (this.sortBy == "Price") {
          if (this.ascending) {
            return this.Lessons.sort((a, b) => b.price - a.price);
          } else {
            return this.Lessons.sort((a, b) => a.price - b.price);
          }
        } else if (this.sortBy == "Spaces") {
          if (this.ascending) {
            return this.Lessons.sort((a, b) => b.spaces - a.spaces);
          } else {
            return this.Lessons.sort((a, b) => a.spaces - b.spaces);
          }
        }
      });
    },
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },

    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
      console.log("ServiceWorkers Unregistered");
    },

    deleteAllCaches() {
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
      });
      console.log("All Caches Deleted");
    },

    updateSortBy(newSortBy) {
      // Update sortBy property in the parent component
      this.sortBy = newSortBy;
    },
    // Update this method based on your existing methods
    async fetchLessons() {
      try {
        const apiUrl = "https://asa-backend.onrender.com"; // Replace with your actual API URL

        const response = await fetch(`${apiUrl}/api/lessons`, {
          referrerPolicy: "unsafe-url",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const lessonsData = await response.json();
        this.Lessons = lessonsData; // Assuming the response data is an array of lessons
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    },

    getLessonImageUrl(imageName) {
      // Replace 'http://localhost:3001' with your actual API server URL
      return `https://asa-backend.onrender.com/api/lessons/lesson-images/${imageName}`;
    },

    // update spaces (PUT)
    async updateLessonSpace(lessonId, newSpaces) {
      try {
        const apiUrl = "https://asa-backend.onrender.com"; // Replace with your actual API URL

        const response = await fetch(`${apiUrl}/api/lessons/${lessonId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ spaces: newSpaces }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Log the response or handle it as needed
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.error("Error updating lesson space:", error);
      }
    },

    addToCart(Lesson) {
      const index = this.cart.findIndex((item) => item._id === Lesson._id);

      // If the lesson is already in the cart, increment the quantity
      if (index !== -1) {
        this.cart[index].quantity++;
      } else {
        // Otherwise, add the lesson to the cart with quantity 1
        this.cart.push({ id: Lesson._id, quantity: 1, ...Lesson });
      }

      // Update the spaces property of the Lesson object
      Lesson.spaces -= 1;
      // console.log("Cart:", this.cart);
    },

    removeFromCart(lesson) {
      const cartIndex = this.cart.findIndex((item) => item._id === lesson._id);

      if (cartIndex !== -1) {
        // If the item is in the cart, update spaces locally (increase by 1)
        const lessonIndex = this.Lessons.findIndex(
          (item) => item._id === lesson._id
        );

        if (lessonIndex !== -1) {
          this.Lessons[lessonIndex].spaces += 1;
        }

        // Decrement the quantity by 1
        this.cart[cartIndex].quantity -= 1;

        // Remove the item from the cart if quantity becomes 0
        if (this.cart[cartIndex].quantity === 0) {
          this.cart.splice(cartIndex, 1);
        }

        // Log the current cart for testing
        console.log("Cart:", this.cart);
      }
    },
    submitForm() {
      if (this.order.FullName.length === 0) {
        this.order.isNameValid = false;
      } else {
        this.order.isNameValid = true;
      }

      if (this.order.PhoneNumber.length === 0) {
        this.order.isPhoneValid = false;
      } else {
        this.order.isPhoneValid = true;
      }

      // Check if all validations pass
      if (this.order.isNameValid && this.order.isPhoneValid) {
        // Perform your form submission logic
        const order = [];
        // getting order information
        this.cart.forEach((obj) => {
          const id = obj["id"];
          const quantity = obj["quantity"];
          const subject = obj["subject"];
          const spaces = obj["spaces"];
          const newSpaces = spaces - quantity;
          order.push({ id: id, subject: subject, spaces: quantity });

          // calling method to update spaces
          this.updateLessonSpace(id, newSpaces);
        });
        const data = {
          name: this.order.FullName,
          number: this.order.PhoneNumber,
          lesson: order,
        };
        fetch("https://asa-backend.onrender.com/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((responseData) => {
            alert("Order submitted!");
            // Clear the cart after successful submission
            this.cart = [];
            this.order.FullName = "";
            this.order.PhoneNumber = "";
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    },
    canAddToCart(Lesson) {
      return Lesson.spaces > this.cartCount(Lesson.id);
    },
    canUpdateToCart(Lesson) {
      return this.cart.length >= 1;
    },
    cartCount(id) {
      return this.cart.filter((item) => item.id === id).length;
    },
    sortData() {
      this.ascending = true;
    },
    sortDataDesc() {
      this.ascending = false;
    },
    showCheckout() {
      this.showLesson = !this.showLesson;
    },
    goToHome() {
      this.showLesson = true;
    },
  },
  mounted() {
    // Call necessary methods or perform actions on component mount
    this.fetchLessons();
  },
};
</script>

<style scoped>
/* Your existing scoped styles */
</style>
