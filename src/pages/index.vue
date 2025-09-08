<script setup>
import { onMounted, ref, watch } from 'vue'
import { supabase } from '../composables/supabase'
import { useUserStore } from '../stores/userStore'

const store = useUserStore()
const showNotify = ref(false)
const email = ref('')
const waitlistMsg = ref(null)

const apkUrl = import.meta.env.VITE_APK_URL || '/dropzone.apk'

function handleDownload() {
  // Optionally call your analytics endpoint here before redirecting
  window.location.href = apkUrl // Trigger immediate navigation to the APK
}

function openNotifyModal() {
  showNotify.value = true
}
function closeNotify() {
  showNotify.value = false
  waitlistMsg.value = null
}

async function submitWaitlist() {
  if (!supabase) {
    waitlistMsg.value = 'Waitlist is not configured. Add Supabase env vars to enable.'
    return
  }
  const table = import.meta.env.VITE_WAITLIST_TABLE || 'waitlist'
  const { _data, error } = await supabase.from(table).insert([{ email: email.value, created_at: new Date().toISOString() }])
  if (error) {
    waitlistMsg.value = 'Something went wrong. Try again.'
    console.error(error)
  }
  else {
    waitlistMsg.value = 'Thanks! We will notify you.'
    email.value = ''
  }
}

// Animated counter (smooth increment)
const animatedCount = ref(0)
let counterTimer = null

function animateTo(target) {
  if (counterTimer)
    clearInterval(counterTimer)
  const start = Number(animatedCount.value)
  const end = Number(target)
  const diff = end - start
  const steps = 30
  let i = 0
  counterTimer = setInterval(() => {
    i++
    animatedCount.value = Math.floor(start + (diff * (i / steps)))
    if (i >= steps)
      clearInterval(counterTimer)
  }, 40)
}

onMounted(async () => {
  await store.fetchUserCount()
  animateTo(store.userCount)
  // poll every 20s for live count updates
  setInterval(async () => {
    await store.fetchUserCount()
    animateTo(store.userCount)
  }, 20000)
})

watch(() => store.userCount, (v) => {
  animateTo(v)
})
</script>

<template>
  <main class="bg-gradient-to-b text-slate-900 min-h-screen from-white to-slate-50">
    <!-- NAV -->
    <nav class="mx-auto px-5 py-4 flex items-center justify-between">
      <div class="flex gap-3 items-center">
        <!-- <div class="bg-gradient-to-r text-white font-bold rounded-lg flex h-10 w-10 items-center justify-center from-indigo-500 to-pink-500">
          DZ
        </div> -->
        <img src="/favicon.svg" alt="Logo" class="h-10 w-10">
        <div>
          <div class="text-sm text-light-50 font-semibold flex gap-2 items-center">
            DropZone
            <span class="text-[10px] text-white tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-500 uppercase">
              Beta
            </span>
          </div>
          <div class="text-xs text-slate-300">
            DROP | DISCOVER | CONNECT
          </div>
        </div>
      </div>
      <div class="text-light-50 gap-3 hidden items-center sm:flex">
        <a class="text-sm" href="#features">Features</a>
        <a class="text-sm" href="#download">Download</a>
      </div>
    </nav>

    <!-- HERO -->
    <section class="mx-auto px-5 py-8 flex flex-col gap-6 max-w-4xl items-start xl:ps-50">
      <h1 class="text-3xl text-light-50 leading-tight font-extrabold sm:text-6xl">
        DropZone
      </h1>
      <p class="text-sm text-slate-100 text-start max-w-xl md:text-base">
        A fresh take on social media — built for the way you connect.
        Share Quick photos or video, write heartfelt letters or notes, chat and exchange posts or articles.
      </p>

      <div class="flex flex-col gap-3 w-full sm:flex-row">
        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            :href="apkUrl"
            class="text-white font-medium px-5 py-3 rounded-lg bg-black inline-flex gap-2 shadow-md items-center justify-center hover:opacity-95"
            @click.prevent="handleDownload"
          >
            <img src="/android_logo.png" alt="Android" class="h-5 w-5">
            Download for Android
          </a>

          <button
            class="text-sm px-4 py-3 border border-slate-200 rounded-lg bg-white inline-flex items-center justify-center"
            @click="openNotifyModal"
          >
            iOS — Notify me
          </button>
        </div>

        <div class="flex gap-1 items-baseline sm:ml-auto sm:flex-row">
          <div class="font-semibold px-3 py-2">
            <span class="text-bold text-3xl text-white">{{ animatedCount }}</span>
          </div>
          <div class="text-xs text-slate-50">
            Users
          </div>
        </div>
      </div>

      <img class="border border-slate-100 rounded-xl w-full shadow-md sm:w-2/3" src="/cover_photo.jpg" alt="app screenshot">
    </section>

    <!-- FEATURES -->
    <!-- <section id="features" class="mx-auto px-5 py-8 max-w-4xl">
      <h2 class="text-xl font-bold mb-4">
        Why DropZone?
      </h2>
      <ul class="gap-4 grid grid-cols-1 sm:grid-cols-2">
        <li class="p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold">
            Local-first
          </h3>
          <p class="text-sm text-slate-600">
            See posts and drops near you — not the whole world.
          </p>
        </li>
        <li class="p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold">
            Low-data & fast
          </h3>
          <p class="text-sm text-slate-600">
            Optimized for mobile connections and small devices.
          </p>
        </li>
        <li class="p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold">
            Community tools
          </h3>
          <p class="text-sm text-slate-600">
            Tags, groups, and moderated town channels.
          </p>
        </li>
        <li class="p-4 rounded-lg bg-white shadow-sm">
          <h3 class="font-semibold">
            Privacy-friendly
          </h3>
          <p class="text-sm text-slate-600">
            You control what you share — and with whom.
          </p>
        </li>
      </ul>
    </section> -->

    <!-- DOWNLOAD & FAQ -->
    <!-- <section id="download" class="mx-auto px-5 py-8 max-w-4xl">
      <h2 class="text-xl font-bold mb-4">
        Download & install
      </h2>
      <div class="p-5 rounded-lg bg-white shadow-sm">
        <ol class="text-sm text-slate-700 pl-5 list-decimal space-y-2">
          <li>Tap <strong>Download Android APK</strong>. The file will download to your phone.</li>
          <li>If you get a warning about "unknown sources", allow installation from your browser or file manager in Settings → Apps → Install unknown apps.</li>
          <li>Open the APK and follow the prompts to install.</li>
        </ol>

        <div class="mt-4">
          <strong>Note:</strong> We recommend you host the APK on your own storage (e.g. Supabase Storage, S3, or your server) and keep the URL in <code>VITE_APK_URL</code>.
        </div>
      </div>
    </section> -->

    <!-- FOOTER + small print -->
    <footer class="text-sm text-slate-100 mx-auto px-5 py-8 max-w-4xl">
      <div class="flex flex-col gap-4 items-start justify-between sm:flex-row">
        <div>
          &copy; DropZone — Built for communities. <br>
          App ready for Android. iOS coming soon.
        </div>

        <div class="text-right">
          <a class="underline" href="#privacy">Privacy</a>
        </div>
      </div>
    </footer>

    <!-- NOTIFY MODAL -->
    <div v-if="showNotify" class="p-4 bg-black/40 flex items-center inset-0 justify-center fixed">
      <div class="p-5 rounded-lg bg-white max-w-md w-full">
        <h3 class="text-lg font-bold">
          Get notified when iOS is ready
        </h3>
        <p class="text-sm text-slate-600 mt-2">
          Leave your email and we'll invite you to TestFlight.
        </p>
        <form class="mt-4" @submit.prevent="submitWaitlist">
          <input v-model="email" type="email" required placeholder="you@domain.com" class="p-3 border rounded-md w-full">
          <div class="mt-3 flex gap-2 items-center">
            <button class="text-white px-4 py-2 rounded-md bg-[#B39254]">
              Notify me
            </button>
            <button type="button" class="px-3 py-2 border rounded-md" @click="closeNotify">
              Cancel
            </button>
          </div>
        </form>
        <div v-if="waitlistMsg" class="text-sm mt-3">
          {{ waitlistMsg }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* minimal extra styles — Tailwind does most heavy lifting */
</style>
