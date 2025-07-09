<template>
  <div class="location">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">오시는 길 안내</h1>
      <p class="text-gray-600">백성운수 회사 위치를 확인하세요</p>
    </div>

    <!-- Map Container -->
    <div class="card p-6 mb-6">
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-2">백성운수</h2>
        <p class="text-gray-600">경기도 안성시 금석길 14</p>
      </div>

      <!-- Kakao Map -->
      <div id="map" class="w-full h-96 rounded-lg bg-gray-100 border"></div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button @click="openKakaoMap" class="btn btn-outline btn-sm">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          카카오맵에서 보기
        </button>
        <button @click="copyAddress" class="btn btn-outline btn-sm">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          주소 복사
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: "LocationMap",
  setup() {
    const companyInfo = {
      name: "백성운수",
      address: "경기도 안성시 금석길 14",
      lat: 37.02689217590517,
      lng: 127.26608667911991,
    };

    const initMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(companyInfo.lat, companyInfo.lng),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          companyInfo.lat,
          companyInfo.lng
        ),
      });
      marker.setMap(map);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;"><strong>${companyInfo.name}</strong><br>${companyInfo.address}</div>`,
      });
      infowindow.open(map, marker);
    };

    const showCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) =>
            alert(`현재 위치: ${coords.latitude}, ${coords.longitude}`),
          () => alert("위치 정보를 가져올 수 없습니다.")
        );
      } else {
        alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      }
    };

    const openKakaoMap = () => {
      const url = `https://map.kakao.com/link/map/${encodeURIComponent(
        companyInfo.name
      )},${companyInfo.lat},${companyInfo.lng}`;
      window.open(url, "_blank");
    };

    const copyAddress = async () => {
      try {
        await navigator.clipboard.writeText(companyInfo.address);
        alert("주소가 복사되었습니다.");
      } catch (error) {
        alert("복사에 실패했습니다.");
      }
    };

    onMounted(() => {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          initMap();
        });
      };
      document.head.appendChild(script);
    });

    return {
      showCurrentLocation,
      openKakaoMap,
      copyAddress,
    };
  },
};
</script>
