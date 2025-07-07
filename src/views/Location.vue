<template>
  <div class="location">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">위치 안내</h1>
      <p class="text-gray-600">백성운수 회사 위치 및 주변 정보를 확인하세요</p>
    </div>

    <!-- Map Container -->
    <div class="card p-6 mb-6">
      <div class="mb-4">
        <h2 class="text-xl font-semibold mb-2">백성운수 본사</h2>
        <p class="text-gray-600">경기도 안성시 금석길 14</p>
      </div>

      <!-- Kakao Map -->
      <div id="map" class="w-full h-96 rounded-lg bg-gray-100 border"></div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button @click="showCurrentLocation" class="btn btn-outline btn-sm">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          내 위치
        </button>
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

    <!-- Location Info -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Company Info -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">회사 정보</h3>
        <div class="space-y-4">
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-primary-600 mr-3 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <h4 class="font-medium">주소</h4>
              <p class="text-gray-600">경기도 안성시 금석길 14</p>
            </div>
          </div>

          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-primary-600 mr-3 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <h4 class="font-medium">전화번호</h4>
              <p class="text-gray-600">031-673-3456</p>
            </div>
          </div>

          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-primary-600 mr-3 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 class="font-medium">운영시간</h4>
              <p class="text-gray-600">
                평일: 05:30 ~ 23:00<br />
                주말/공휴일: 06:00 ~ 22:30
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-primary-600 mr-3 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <h4 class="font-medium">이메일</h4>
              <p class="text-gray-600">baeksungbus@email.com</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transportation -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">교통편 안내</h3>
        <div class="space-y-4">
          <div>
            <h4 class="font-medium mb-2 flex items-center">
              <svg
                class="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 01-2-2V9a2 2 0 012-2h2Z"
                />
              </svg>
              버스
            </h4>
            <ul class="text-gray-600 space-y-1">
              <li>• 평택역 → 안중 (15번, 25번)</li>
              <li>• 송탄 → 안중 (30번, 35번)</li>
              <li>• 현화리 정류장 하차</li>
            </ul>
          </div>

          <div>
            <h4 class="font-medium mb-2 flex items-center">
              <svg
                class="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              지하철 + 버스
            </h4>
            <ul class="text-gray-600 space-y-1">
              <li>• 1호선 평택역 하차</li>
              <li>• 평택역 버스정류장에서 25번 탑승</li>
              <li>• 소요시간: 약 40분</li>
            </ul>
          </div>

          <div>
            <h4 class="font-medium mb-2 flex items-center">
              <svg
                class="w-5 h-5 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 6h3l3 3v8a2 2 0 01-2 2h-2M9 17H7a2 2 0 01-2-2v-8a2 2 0 012-2h2m0 0V3a2 2 0 012-2h2a2 2 0 012 2v2"
                />
              </svg>
              자가용
            </h4>
            <ul class="text-gray-600 space-y-1">
              <li>• 서해안고속도로 안중IC 이용</li>
              <li>• 평택시청 방면 진행</li>
              <li>• 주차공간 20대 확보</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Nearby Facilities -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold mb-4">주변 시설</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 class="font-medium mb-3 flex items-center">
            <svg
              class="w-5 h-5 text-blue-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            공공기관
          </h4>
          <ul class="text-gray-600 space-y-1 text-sm">
            <li>• 안중읍사무소 (500m)</li>
            <li>• 안중파출소 (300m)</li>
            <li>• 평택소방서 안중119센터 (1km)</li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium mb-3 flex items-center">
            <svg
              class="w-5 h-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            교육기관
          </h4>
          <ul class="text-gray-600 space-y-1 text-sm">
            <li>• 안중초등학교 (800m)</li>
            <li>• 안중중학교 (1.2km)</li>
            <li>• 안중고등학교 (1.5km)</li>
          </ul>
        </div>

        <div>
          <h4 class="font-medium mb-3 flex items-center">
            <svg
              class="w-5 h-5 text-purple-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            편의시설
          </h4>
          <ul class="text-gray-600 space-y-1 text-sm">
            <li>• 안중시장 (600m)</li>
            <li>• 롯데마트 안중점 (1km)</li>
            <li>• GS25 현화점 (200m)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  name: "Location",
  setup() {
    const companyInfo = {
      name: "백성운수",
      address: "경기도 안성시 금석길 14",
      lat: 37.0356,
      lng: 127.0449,
    };

    const initMap = () => {
      // 카카오맵 API가 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(
            companyInfo.lat,
            companyInfo.lng
          ),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        // 마커 표시
        const markerPosition = new window.kakao.maps.LatLng(
          companyInfo.lat,
          companyInfo.lng
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우 표시
        const iwContent = `
          <div style="padding:5px;">
            <strong>${companyInfo.name}</strong><br>
            ${companyInfo.address}
          </div>
        `;
        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent,
        });
        infowindow.open(map, marker);
      } else {
        // 카카오맵 API가 없을 경우 대체 텍스트 표시
        const mapContainer = document.getElementById("map");
        if (mapContainer) {
          mapContainer.innerHTML = `
            <div class="flex items-center justify-center h-full">
              <div class="text-center">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                <p class="text-gray-600">지도를 불러올 수 없습니다</p>
                <p class="text-sm text-gray-500 mt-2">${companyInfo.address}</p>
              </div>
            </div>
          `;
        }
      }
    };

    const showCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log("현재 위치:", lat, lng);
            // 현재 위치를 지도에 표시하는 로직 추가
            alert(`현재 위치: ${lat}, ${lng}`);
          },
          (error) => {
            console.error("위치 정보를 가져올 수 없습니다:", error);
            alert("위치 정보를 가져올 수 없습니다.");
          }
        );
      } else {
        alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      }
    };

    const openKakaoMap = () => {
      const url = `https://map.kakao.com/link/map/${encodeURIComponent(companyInfo.name)},${companyInfo.lat},${companyInfo.lng}`;
      window.open(url, "_blank");
    };

    const copyAddress = async () => {
      try {
        await navigator.clipboard.writeText(companyInfo.address);
        alert("주소가 복사되었습니다.");
      } catch (error) {
        console.error("복사 실패:", error);
        alert("복사에 실패했습니다.");
      }
    };

    onMounted(() => {
      initMap();
    });

    return {
      showCurrentLocation,
      openKakaoMap,
      copyAddress,
    };
  },
};
</script>
