<script setup>
import { RouterLink, RouterView } from "vue-router";
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
      <!-- Lesson page -->
      <div v-if="showLesson" class="container-fluid p-5">
        <!--  Sorting category -->
        <div class="p-3">
          <select
            class="btn btn-dark dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            v-model="sortBy"
          >
            <option disabled value="default">Choose your preference</option>
            <option value="Price">Price</option>
            <option value="Location">Location</option>
            <option value="Spaces">Spaces</option>
            <option value="Subject">Subject</option>
          </select>
          <button class="btn btn-dark" @click="sortData">
            <span class="fas fa-long-arrow-alt-up"></span>
          </button>
          <button class="btn btn-dark" @click="sortDataDesc">
            <span class="fas fa-long-arrow-alt-down"></span>
          </button>
        </div>
        <div v-for="lesson in filteredAndSortedLessons" class="d-flex p-2">
          <div class="p-2">
            <figure>
              <img :src="getLessonImageUrl(lesson.image)" alt="Lesson Image" />
            </figure>
          </div>
          <div class="p-3">
            <h2 v-text="lesson.subject"></h2>
            <p v-text="lesson.location"></p>
            <p>Price: {{ lesson.price }}</p>
            <p v-if="lesson.spaces === cartCount(lesson.id)"></p>
            <p v-else>
              This Lesson space remains
              {{ lesson.spaces - cartCount(lesson.id) }} spaces
            </p>
            <button
              class="btn btn-primary"
              v-on:click="addToCart(lesson)"
              v-if="canAddToCart(lesson)"
            >
              Add to cart
            </button>
            <button class="btn btn-secondary" disabled="disabled" v-else>
              Add to cart
            </button>
            <span v-if="lesson.spaces === cartCount(lesson.id)"
              >No more available spaces!</span
            >
            <span v-else-if="lesson.spaces - cartCount(lesson.id) < 5"
              >Only few left!</span
            >
            <span v-else>Buy now!</span>
            <div>
              <span v-for="n in lesson.rating">★</span>
              <span v-for="n in 5 - lesson.rating">☆</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="container p-5">
        <div v-if="sortedCart.length === 0" class="container p-5">
          <button class="btn btn-warning" v-on:click="goToHome">
            Back to Home Page
          </button>
        </div>
        <div v-else class="container p-5">
          <div v-for="Lesson in sortedCart" class="d-flex p-2">
            <div class="p-2">
              <figure>
                <img
                  :src="getLessonImageUrl(Lesson.image)"
                  alt="Lesson Image"
                />
              </figure>
            </div>
            <div class="p-3">
              <h2 v-text="Lesson.subject"></h2>
              <p v-text="Lesson.location"></p>
              <p>Price: {{ Lesson.price }}</p>
              <p>Quantity: {{ Lesson.quantity }}</p>
              <button
                class="btn btn-danger"
                v-on:click="removeFromCart(Lesson)"
              >
                Remove
              </button>

              <div>
                <span v-for="n in Lesson.rating">★</span>
                <span v-for="n in 5 - Lesson.rating">☆</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Checkout page -->
        <h2>Checkout</h2>
        <div class="mb-3 mt-3">
          <p>
            <strong>Your Full Name:</strong>
            <!-- regular expressions -->
            <input
              class="form-control"
              pattern="[a-zA-Z]+"
              title="Only text input is allowed"
              required
              oninput="this.value = this.value.replace(/[^a-zA-Z- ]/g, '')"
              v-model="order.FullName"
              placeholder="letters only"
            />
            <span
              v-if="!order.isNameValid && order.FullName.length === 0"
              class="text-danger"
              >Name is required</span
            >
            <span
              v-if="!order.isNameValid && order.FullName.length > 0"
              class="text-danger"
              >Invalid name</span
            >
          </p>
        </div>
        <div>
          <p>
            <strong>Phone Number:</strong>
            <!-- regular expressions -->
            <input
              class="form-control"
              pattern="[0-9]+"
              title="Only numbers input is allowed"
              required
              oninput="this.value = this.value.replace(/[^0-9-+]/g, '')"
              v-model="order.PhoneNumber"
              placeholder="numbers only"
            />
            <span
              v-if="!order.isPhoneValid && order.PhoneNumber.length === 0"
              class="text-danger"
              >Phone number is required</span
            >
          </p>
        </div>
        <h2>Order Information</h2>
        <p>Full Name: {{ order.FullName }}</p>
        <p>Phone Number: {{ order.PhoneNumber }}</p>
        <button class="btn btn-primary" v-on:click="submitForm">
          Place Order
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sitename: "After school activities", // Replace with your site name
      searchInput: "",
      showLesson: true, // Initial state, modify as needed
      sortBy: "default", // Initial state, modify as needed
      ascending: true, // Initial state, modify as needed
      Lessons: [], // Your lessons array
      Lesson: {}, // Your single lesson object
      cart: [],
      filteredAndSortedLessons: [],
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
    // ... (your existing methods)
    // Update this method based on your existing methods
    async fetchLessons() {
      try {
        const apiUrl = "http://after-school-classes-and-activit-env-1.eba-jnm2dueu.eu-north-1.elasticbeanstalk.com"; // Replace with your actual API URL

        const response = await fetch(`${apiUrl}/api/lessons`);
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
      return `http://after-school-classes-and-activit-env-1.eba-jnm2dueu.eu-north-1.elasticbeanstalk.com/api/lessons/lesson-images/${imageName}`;
    },

    // update spaces (PUT)
    async updateLessonSpace(lessonId, newSpaces) {
      try {
        const apiUrl = "http://after-school-classes-and-activit-env-1.eba-jnm2dueu.eu-north-1.elasticbeanstalk.com"; // Replace with your actual API URL

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
        fetch("http://after-school-classes-and-activit-env-1.eba-jnm2dueu.eu-north-1.elasticbeanstalk.com/api/orders", {
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
