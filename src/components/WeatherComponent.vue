<template>
  <div class="weather-component drop-shadow text-[#fff] text-[20px] sm:text-[28px]">
      <el-dropdown :hide-on-click="false" trigger="click" @command="fetchWeatherData" @visible-change="onVisibleChange" max-height="200">
        <span class="el-dropdown-link flex items-center text-[#fff] text-[20px] sm:text-[28px]">
          {{city}}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-select v-model="city" ref="citySelectRef" class="w-[150px]" filterable placeholder="请选择城市" @change="fetchWeatherData">
            <el-option v-for="city in citys" :key="city.value" :label="city.name" :value="city.value" />
          </el-select>
        </template>
      </el-dropdown>
      <div v-html="weatherIcon" alt="Weather Icon"></div>
      <span>{{ temperature }}<span class="ml-2 text-xl">°C</span></span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { getCityByGeolocation } from '@/utils';
import { ArrowDown } from '@element-plus/icons-vue';
const weatherIcons = {
    '晴': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="36" stroke-dashoffset="36" d="M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"/></path><path stroke-dasharray="2" stroke-dashoffset="2" d="M12 19v1M19 12h1M12 5v-1M5 12h-1" opacity="0"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="2;0"/><set fill="freeze" attributeName="opacity" begin="0.6s" to="1"/><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path><path stroke-dasharray="2" stroke-dashoffset="2" d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5" opacity="0"><animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0"/><set fill="freeze" attributeName="opacity" begin="0.8s" to="1"/><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></g></svg>',
    '多云': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Lucide by Lucide Contributors - https://github.com/lucide-icons/lucide/blob/main/LICENSE --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9"/><path d="M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5"/></g></svg>',
    '阴': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 14 14"><!-- Icon from Streamline by Streamline - https://creativecommons.org/licenses/by/4.0/ --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M10.726 5.706a2.34 2.34 0 0 0-.449 0a3.356 3.356 0 0 0-6.554 0a2.34 2.34 0 0 0-.45 0a2.614 2.614 0 1 0 0 5.219h7.453a2.613 2.613 0 1 0 0-5.219Z"/></svg>',
    '阵雨': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M13.95 21.9q-.375.2-.762.063t-.588-.513l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587m6 0q-.375.2-.762.063t-.588-.513l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587m-12 0q-.375.2-.762.063T6.6 21.45l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587M7.5 16q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '雷阵雨': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Unicons by Iconscout - https://github.com/Iconscout/unicons/blob/master/LICENSE --><path fill="currentColor" d="M13.5 15h-2.27l1.45-2.5a1 1 0 1 0-1.74-1l-2.31 4a1 1 0 0 0 0 1a1 1 0 0 0 .87.5h2.27l-1.45 2.5a1 1 0 0 0 1.74 1l2.31-4a1 1 0 0 0 0-1a1 1 0 0 0-.87-.5m4.92-7.79a7 7 0 0 0-13.36 1.9A4 4 0 0 0 6 17a1 1 0 0 0 0-2a2 2 0 0 1 0-4a1 1 0 0 0 1-1a5 5 0 0 1 9.73-1.61a1 1 0 0 0 .78.66A3 3 0 0 1 17 15a1 1 0 0 0 0 2a5 5 0 0 0 1.42-9.79"/></svg>',
    '小雨': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M13.95 21.9q-.375.2-.762.063t-.588-.513l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587m6 0q-.375.2-.762.063t-.588-.513l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587m-12 0q-.375.2-.762.063T6.6 21.45l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587M7.5 16q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '中雨': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 56 56"><!-- Icon from Framework7 Icons by Vladimir Kharlampidi - https://github.com/framework7io/framework7-icons/blob/master/LICENSE --><path fill="currentColor" d="M12.262 36.484h29.086c7.687 0 13.406-5.836 13.406-13.078c0-7.453-6.094-12.914-14.04-12.914C37.786 4.703 32.349.977 25.575.977c-8.812 0-16.078 6.89-16.851 15.609c-4.243 1.219-7.477 4.922-7.477 9.867c0 5.531 4.031 10.031 11.016 10.031m-.047-3.773c-4.805 0-7.219-2.672-7.219-6.14c0-2.837 1.64-5.368 5.625-6.423c1.29-.328 1.758-.937 1.875-2.273c.54-7.64 6.281-13.148 13.078-13.148c5.274 0 9.422 2.882 11.953 8.086c.54 1.124 1.242 1.523 2.625 1.523c6.938 0 10.852 4.195 10.852 9.187c0 5.11-4.078 9.188-9.422 9.188ZM7.832 54.109l6.867-11.93c.446-.75.211-1.546-.492-1.968c-.703-.398-1.5-.188-1.945.539l-6.89 11.977c-.376.68-.188 1.5.515 1.921a1.44 1.44 0 0 0 1.945-.539m9.328 0l6.89-11.93c.423-.75.188-1.546-.491-1.968c-.727-.398-1.524-.188-1.946.539L14.7 52.727c-.375.68-.187 1.5.54 1.921c.702.375 1.546.141 1.921-.539m9.328 0l6.89-11.93c.423-.75.188-1.546-.491-1.968c-.727-.398-1.524-.188-1.946.539l-6.914 11.977c-.375.68-.187 1.5.54 1.921c.679.375 1.546.141 1.921-.539m9.282.024l6.914-12c.421-.703.21-1.547-.493-1.922c-.68-.352-1.5-.188-1.922.516L33.403 52.68c-.422.726-.234 1.547.47 1.968a1.407 1.407 0 0 0 1.898-.515"/></svg>',
    '大雨': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 56 56"><!-- Icon from Framework7 Icons by Vladimir Kharlampidi - https://github.com/framework7io/framework7-icons/blob/master/LICENSE --><path fill="currentColor" d="M12.262 36.484h29.086c7.687 0 13.406-5.836 13.406-13.078c0-7.453-6.094-12.914-14.04-12.914C37.786 4.703 32.349.977 25.575.977c-8.812 0-16.078 6.89-16.851 15.609c-4.243 1.219-7.477 4.922-7.477 9.867c0 5.531 4.031 10.031 11.016 10.031m-.047-3.773c-4.805 0-7.219-2.672-7.219-6.14c0-2.837 1.64-5.368 5.625-6.423c1.29-.328 1.758-.937 1.875-2.273c.54-7.64 6.281-13.148 13.078-13.148c5.274 0 9.422 2.882 11.953 8.086c.54 1.124 1.242 1.523 2.625 1.523c6.938 0 10.852 4.195 10.852 9.187c0 5.11-4.078 9.188-9.422 9.188ZM7.832 54.109l6.867-11.93c.446-.75.211-1.546-.492-1.968c-.703-.398-1.5-.188-1.945.539l-6.89 11.977c-.376.68-.188 1.5.515 1.921a1.44 1.44 0 0 0 1.945-.539m9.328 0l6.89-11.93c.423-.75.188-1.546-.491-1.968c-.727-.398-1.524-.188-1.946.539L14.7 52.727c-.375.68-.187 1.5.54 1.921c.702.375 1.546.141 1.921-.539m9.328 0l6.89-11.93c.423-.75.188-1.546-.491-1.968c-.727-.398-1.524-.188-1.946.539l-6.914 11.977c-.375.68-.187 1.5.54 1.921c.679.375 1.546.141 1.921-.539m9.282.024l6.914-12c.421-.703.21-1.547-.493-1.922c-.68-.352-1.5-.188-1.922.516L33.403 52.68c-.422.726-.234 1.547.47 1.968a1.407 1.407 0 0 0 1.898-.515"/></svg>',
    '暴雨': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from MingCute Icon by MingCute Design - https://github.com/Richard9394/MingCute/blob/main/LICENSE --><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M11.5 2A6.5 6.5 0 0 0 5 8.416a5 5 0 0 0-2.33 7.085a1 1 0 0 0 1.73-1.002a3.002 3.002 0 0 1 1.868-4.41A1.01 1.01 0 0 0 7.029 9a4.5 4.5 0 0 1 8.817-1.679c.103.383.42.67.81.733a4 4 0 0 1 2.546 6.346a1 1 0 0 0 1.599 1.202a6.002 6.002 0 0 0-3.214-9.389A6.5 6.5 0 0 0 11.5 2M7.032 14.136a1 1 0 0 1 .707 1.225l-1.553 5.796a1 1 0 0 1-1.932-.518l1.553-5.795a1 1 0 0 1 1.225-.708m10.5 0a1 1 0 0 1 .707 1.225l-1.553 5.796a1 1 0 0 1-1.932-.518l1.553-5.795a1 1 0 0 1 1.225-.708m-7 0a1 1 0 0 1 .707 1.225l-1.553 5.796a1 1 0 0 1-1.932-.518l1.553-5.795a1 1 0 0 1 1.225-.707Zm4.207 1.225a1 1 0 0 0-1.932-.518l-1.553 5.796a1 1 0 1 0 1.932.518z"/></g></svg>',
    '小雪': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M6 19q-.425 0-.712-.288T5 18t.288-.712T6 17t.713.288T7 18t-.288.713T6 19m12 0q-.425 0-.712-.288T17 18t.288-.712T18 17t.713.288T19 18t-.288.713T18 19m-9 4q-.425 0-.712-.288T8 22t.288-.712T9 21t.713.288T10 22t-.288.713T9 23m3-4q-.425 0-.712-.288T11 18t.288-.712T12 17t.713.288T13 18t-.288.713T12 19m3 4q-.425 0-.712-.288T14 22t.288-.712T15 21t.713.288T16 22t-.288.713T15 23m-7.5-7q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '中雪': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M6 19q-.425 0-.712-.288T5 18t.288-.712T6 17t.713.288T7 18t-.288.713T6 19m12 0q-.425 0-.712-.288T17 18t.288-.712T18 17t.713.288T19 18t-.288.713T18 19m-9 4q-.425 0-.712-.288T8 22t.288-.712T9 21t.713.288T10 22t-.288.713T9 23m3-4q-.425 0-.712-.288T11 18t.288-.712T12 17t.713.288T13 18t-.288.713T12 19m3 4q-.425 0-.712-.288T14 22t.288-.712T15 21t.713.288T16 22t-.288.713T15 23m-7.5-7q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '大雪': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M6 19q-.425 0-.712-.288T5 18t.288-.712T6 17t.713.288T7 18t-.288.713T6 19m12 0q-.425 0-.712-.288T17 18t.288-.712T18 17t.713.288T19 18t-.288.713T18 19m-9 4q-.425 0-.712-.288T8 22t.288-.712T9 21t.713.288T10 22t-.288.713T9 23m3-4q-.425 0-.712-.288T11 18t.288-.712T12 17t.713.288T13 18t-.288.713T12 19m3 4q-.425 0-.712-.288T14 22t.288-.712T15 21t.713.288T16 22t-.288.713T15 23m-7.5-7q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '雾': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M18 19q-.425 0-.712-.288T17 18t.288-.712T18 17t.713.288T19 18t-.288.713T18 19M7 22q-.425 0-.712-.288T6 21t.288-.712T7 20t.713.288T8 21t-.288.713T7 22m-1-3q-.425 0-.712-.288T5 18t.288-.712T6 17h9q.425 0 .713.288T16 18t-.288.713T15 19zm4 3q-.425 0-.712-.288T9 21t.288-.712T10 20h7q.425 0 .713.288T18 21t-.288.713T17 22zm-2.5-6q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '霾': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License --><path fill="currentColor" d="M12 19a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m7.5 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m-15 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M17 7a5 5 0 0 1 0 10q-2.765 0-5-3.121Q9.765 16.999 7 17A5 5 0 0 1 7 7q2.765 0 5 3.121Q14.235 7.001 17 7M7 9a3 3 0 1 0 0 6c1.254 0 2.51-.875 3.759-2.854l.089-.147l-.09-.145c-1.197-1.896-2.4-2.78-3.601-2.85zm10 0c-1.254 0-2.51.875-3.759 2.854l-.09.146l.09.146c1.198 1.896 2.4 2.78 3.602 2.85L17 15a3 3 0 1 0 0-6m-5-7a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M4.5 2a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m15 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/></svg>',
    '扬沙': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from MingCute Icon by MingCute Design - https://github.com/Richard9394/MingCute/blob/main/LICENSE --><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M18.5 6a3.5 3.5 0 1 1 0 7H3a1 1 0 1 1 0-2h15.5a1.5 1.5 0 1 0-1.436-1.936l-.034.135a1 1 0 1 1-1.96-.398A3.5 3.5 0 0 1 18.5 6M11 3a3 3 0 1 1 0 6H5a1 1 0 0 1 0-2h6a1 1 0 1 0-.803-1.596l-.064.097a1 1 0 0 1-1.731-1.002A3 3 0 0 1 11 3M5 3a1 1 0 1 1 0 2a1 1 0 0 1 0-2m12 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2M9 19a1 1 0 1 1 0 2a1 1 0 0 1 0-2m5.5-4a2.5 2.5 0 1 1-1.667 4.363a1 1 0 0 1 1.235-1.568l.099.078A.5.5 0 1 0 14.5 17H7a1 1 0 1 1 0-2zm6.5 2a1 1 0 1 1-2 0a1 1 0 0 1 2 0"/></g></svg>',
    '浮尘': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE --><path fill="currentColor" d="M3 5c0-.6.4-1 1-1h1c.6 0 1 .4 1 1s-.4 1-1 1H4c-.6 0-1-.4-1-1m1 8c0-.6.4-1 1-1h1c.6 0 1 .4 1 1s-.4 1-1 1H5c-.6 0-1-.4-1-1m0 3c-.6 0-1 .4-1 1s.4 1 1 1h5c.6 0 1-.4 1-1s-.4-1-1-1zM18 5c0-.6.4-1 1-1h2c.6 0 1 .4 1 1s-.4 1-1 1h-2c-.6 0-1-.4-1-1M7 20c-.6 0-1 .4-1 1s.4 1 1 1h4c.6 0 1-.4 1-1s-.4-1-1-1zM3 10c-.6 0-1-.4-1-1s.4-1 1-1h9c1.1 0 2-.9 2-2s-.9-2-2-2c-.6 0-1.1.2-1.4.6c-.4.4-1 .4-1.4 0s-.4-1 0-1.4C9.9 2.5 10.9 2 12 2c2.2 0 4 1.8 4 4s-1.8 4-4 4zm16 2c.6 0 1-.4 1-1s-.4-1-1-1c-.3 0-.5.1-.7.3c-.4.4-1 .4-1.4 0s-.4-1 0-1.4c.5-.6 1.3-.9 2.1-.9c1.7 0 3 1.3 3 3s-1.3 3-3 3h-9c-.6 0-1-.4-1-1s.4-1 1-1zm-1 6h-5c-.6 0-1-.4-1-1s.4-1 1-1h5c1.7 0 3 1.3 3 3s-1.3 3-3 3c-.8 0-1.6-.3-2.1-.9c-.4-.4-.4-1 0-1.4s1-.4 1.4 0c.2.2.4.3.7.3c.6 0 1-.4 1-1s-.4-1-1-1"/></svg>',
    '雾霾': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/Remix-Design/RemixIcon/blob/master/License --><path fill="currentColor" d="M12 19a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m7.5 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m-15 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M17 7a5 5 0 0 1 0 10q-2.765 0-5-3.121Q9.765 16.999 7 17A5 5 0 0 1 7 7q2.765 0 5 3.121Q14.235 7.001 17 7M7 9a3 3 0 1 0 0 6c1.254 0 2.51-.875 3.759-2.854l.089-.147l-.09-.145c-1.197-1.896-2.4-2.78-3.601-2.85zm10 0c-1.254 0-2.51.875-3.759 2.854l-.09.146l.09.146c1.198 1.896 2.4 2.78 3.602 2.85L17 15a3 3 0 1 0 0-6m-5-7a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M4.5 2a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m15 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/></svg>',
    '雨': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M13.95 21.9q-.375.2-.762.063t-.588-.513l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587m6 0q-.375.2-.762.063t-.588-.513l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587m-12 0q-.375.2-.762.063T6.6 21.45l-1.5-3q-.2-.375-.062-.762t.512-.588t.763-.062t.587.512l1.5 3q.2.375.063.763t-.513.587M7.5 16q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '雪': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M6 19q-.425 0-.712-.288T5 18t.288-.712T6 17t.713.288T7 18t-.288.713T6 19m12 0q-.425 0-.712-.288T17 18t.288-.712T18 17t.713.288T19 18t-.288.713T18 19m-9 4q-.425 0-.712-.288T8 22t.288-.712T9 21t.713.288T10 22t-.288.713T9 23m3-4q-.425 0-.712-.288T11 18t.288-.712T12 17t.713.288T13 18t-.288.713T12 19m3 4q-.425 0-.712-.288T14 22t.288-.712T15 21t.713.288T16 22t-.288.713T15 23m-7.5-7q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '冰雹': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE --><path fill="currentColor" d="M12.5 23L11 21.5l1.5-1.5l1.5 1.5zm-3.45-1.5L8 20.45l2.95-2.95L12 18.55zM15.5 20L14 18.5l1.5-1.5l1.5 1.5zm-9 0L5 18.5L6.5 17L8 18.5zm1-4q-2.275 0-3.887-1.612T2 10.5q0-2.075 1.375-3.625t3.4-1.825q.8-1.425 2.188-2.238T12 2q2.25 0 3.913 1.438t2.012 3.587q1.725.15 2.9 1.425T22 11.5q0 1.875-1.312 3.188T17.5 16zm0-2h10q1.05 0 1.775-.725T20 11.5t-.725-1.775T17.5 9H16V8q0-1.65-1.175-2.825T12 4q-1.2 0-2.187.65T8.325 6.4l-.25.6H7.45q-1.425.05-2.437 1.063T4 10.5q0 1.45 1.025 2.475T7.5 14M12 9"/></svg>',
    '台风': '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from MingCute Icon by MingCute Design - https://github.com/Richard9394/MingCute/blob/main/LICENSE --><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M14 2c2.397 0 4.6.844 6.323 2.252l.985.804c.455.372.16 1.108-.425 1.063l-1.268-.096a8.2 8.2 0 0 0-2.159.126A7.98 7.98 0 0 1 20 12c0 5.523-4.477 10-10 10a9.97 9.97 0 0 1-6.322-2.251l-.985-.805c-.455-.372-.16-1.108.425-1.063l1.268.096c.72.054 1.464.01 2.159-.126A7.98 7.98 0 0 1 4 12C4 6.477 8.478 2 14 2m0 2a8 8 0 0 0-8 8a6 6 0 0 0 3.2 5.308l.719.38a.608.608 0 0 1-.028 1.085c-.731.34-1.472.662-2.249.874A8 8 0 0 0 18 12a6 6 0 0 0-3.199-5.308l-.719-.38a.608.608 0 0 1 .028-1.085c.731-.34 1.472-.662 2.249-.874A8 8 0 0 0 14 4m-2 5a3 3 0 1 1 0 6a3 3 0 0 1 0-6m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2"/></g></svg>'
}
const citys = ref([
  { name: '北京市', value: '北京市' },
  { name: '上海市', value: '上海市' },
  { name: '广州市', value: '广州市' },
  { name: '赣州市', value: '赣州市' },
  { name: '东莞市', value: '东莞市' },
  { name: '中山市', value: '中山市' },
  { name: '深圳市', value: '深圳市' },
  { name: '武汉市', value: '武汉市' },
  { name: '成都市', value: '成都市' },
  { name: '西安市', value: '西安市' },
  { name: '重庆市', value: '重庆市' },
  { name: '杭州市', value: '杭州市' }
]);
const city = ref('深圳市');
const citySelectRef = ref(null);
const weatherIcon = ref(weatherIcons['晴']);
const temperature = ref('25');
watch(city, (newCity) => {
  if (newCity) {
    fetchWeatherData(newCity);
  }
});
const fetchWeatherData = async (location) => {
  city.value = location;
  weatherIcon.value = weatherIcons['晴'];
  try {
    const response = await fetch('https://api.boycot.top/api/weather?location=' + city.value);
    const data = await response.json();
    weatherIcon.value = weatherIcons[data.data.now?.text];
    temperature.value = data.data.now?.temperature;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
};

const getCitys = async () => {
  try {
    const response = await fetch('/region.json');
    const data = await response.json();    
    citys.value = data.cityList.map(el => ({ name: el.regionName, value: el.regionName }));
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
}
getCitys();
const onVisibleChange = (val) => {
  if (val) {
    nextTick(() => {
      citySelectRef.value.focus();
    });
  }
}
onMounted(async () => {
  try {
    city.value = await getCityByGeolocation()
    fetchWeatherData(city.value);
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
});
</script>

<style scoped>
.weather-component {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
::deep(.el-select__wrapper) {
  background-color: transparent !important;
  color: #fff !important;
}
::deep(.el-select__input) {
  color: #fff !important;
}
</style>