import * as React from 'react'
import { TextWrap } from './TextWrap'
import { computed } from 'mobx'
import { observer } from 'mobx-react'
import { ChartConfig } from './ChartConfig'
const isNode: boolean = require('detect-node')

interface LogoProps {
    svg: string
    fontSize: number
}

const LOGO_SVG = `<svg width="210" height="120" viewBox="0 0 210 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <a xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://ourworldindata.org" target="_blank">
        <g clip-path="url(#clip0)">
            <path d="M0 0H210V107.89H0V0Z" fill="#002147"/>
            <path d="M40.9788 32.248C40.9788 34.6093 40.6048 36.78 39.8568 38.76C39.1088 40.7253 38.0528 42.4193 36.6888 43.842C35.3248 45.2647 33.6821 46.372 31.7608 47.164C29.8541 47.9413 27.7421 48.33 25.4248 48.33C23.1074 48.33 20.9954 47.9413 19.0888 47.164C17.1821 46.372 15.5468 45.2647 14.1828 43.842C12.8188 42.4193 11.7628 40.7253 11.0148 38.76C10.2668 36.78 9.89277 34.6093 9.89277 32.248C9.89277 29.8867 10.2668 27.7233 11.0148 25.758C11.7628 23.778 12.8188 22.0767 14.1828 20.654C15.5468 19.2167 17.1821 18.102 19.0888 17.31C20.9954 16.518 23.1074 16.122 25.4248 16.122C27.7421 16.122 29.8541 16.518 31.7608 17.31C33.6821 18.102 35.3248 19.2167 36.6888 20.654C38.0528 22.0767 39.1088 23.778 39.8568 25.758C40.6048 27.7233 40.9788 29.8867 40.9788 32.248ZM36.6008 32.248C36.6008 30.312 36.3368 28.574 35.8088 27.034C35.2808 25.494 34.5328 24.196 33.5648 23.14C32.5968 22.0693 31.4234 21.248 30.0448 20.676C28.6661 20.104 27.1261 19.818 25.4248 19.818C23.7381 19.818 22.2054 20.104 20.8268 20.676C19.4481 21.248 18.2674 22.0693 17.2848 23.14C16.3168 24.196 15.5688 25.494 15.0408 27.034C14.5128 28.574 14.2488 30.312 14.2488 32.248C14.2488 34.184 14.5128 35.922 15.0408 37.462C15.5688 38.9873 16.3168 40.2853 17.2848 41.356C18.2674 42.412 19.4481 43.226 20.8268 43.798C22.2054 44.3553 23.7381 44.634 25.4248 44.634C27.1261 44.634 28.6661 44.3553 30.0448 43.798C31.4234 43.226 32.5968 42.412 33.5648 41.356C34.5328 40.2853 35.2808 38.9873 35.8088 37.462C36.3368 35.922 36.6008 34.184 36.6008 32.248ZM62.8234 25.714V48H60.4914C59.9341 48 59.5821 47.7287 59.4354 47.186L59.1274 44.788C58.1594 45.8587 57.0741 46.724 55.8714 47.384C54.6687 48.0293 53.2901 48.352 51.7354 48.352C50.5181 48.352 49.4401 48.154 48.5014 47.758C47.5774 47.3473 46.8001 46.7753 46.1694 46.042C45.5387 45.3087 45.0621 44.4213 44.7394 43.38C44.4314 42.3387 44.2774 41.1873 44.2774 39.926V25.714H48.1934V39.926C48.1934 41.6127 48.5747 42.918 49.3374 43.842C50.1147 44.766 51.2954 45.228 52.8794 45.228C54.0381 45.228 55.1161 44.9567 56.1134 44.414C57.1254 43.8567 58.0567 43.094 58.9074 42.126V25.714H62.8234ZM71.4305 30.18C72.1346 28.6547 72.9999 27.4667 74.0266 26.616C75.0532 25.7507 76.3072 25.318 77.7886 25.318C78.2579 25.318 78.7052 25.3693 79.1306 25.472C79.5706 25.5747 79.9592 25.736 80.2966 25.956L80.0106 28.882C79.9226 29.2487 79.7026 29.432 79.3506 29.432C79.1452 29.432 78.8446 29.388 78.4486 29.3C78.0526 29.212 77.6052 29.168 77.1066 29.168C76.4026 29.168 75.7719 29.2707 75.2146 29.476C74.6719 29.6813 74.1806 29.9893 73.7406 30.4C73.3152 30.796 72.9266 31.2947 72.5746 31.896C72.2372 32.4827 71.9292 33.1573 71.6506 33.92V48H67.7125V25.714H69.9566C70.3819 25.714 70.6752 25.7947 70.8366 25.956C70.9979 26.1173 71.1079 26.396 71.1666 26.792L71.4305 30.18ZM132.589 16.474L122.755 48H118.927L110.941 23.954C110.867 23.7193 110.794 23.47 110.721 23.206C110.662 22.942 110.596 22.6633 110.523 22.37C110.449 22.6633 110.376 22.942 110.303 23.206C110.23 23.47 110.156 23.7193 110.083 23.954L102.053 48H98.2248L88.3908 16.474H91.9328C92.3142 16.474 92.6295 16.5693 92.8788 16.76C93.1428 16.9507 93.3115 17.1927 93.3848 17.486L99.8968 39.398C99.9995 39.794 100.095 40.2193 100.183 40.674C100.285 41.1287 100.381 41.6127 100.469 42.126C100.571 41.6127 100.674 41.1287 100.777 40.674C100.894 40.2047 101.019 39.7793 101.151 39.398L108.565 17.486C108.653 17.2367 108.821 17.0093 109.071 16.804C109.335 16.584 109.65 16.474 110.017 16.474H111.249C111.63 16.474 111.938 16.5693 112.173 16.76C112.407 16.9507 112.583 17.1927 112.701 17.486L120.093 39.398C120.225 39.7793 120.342 40.19 120.445 40.63C120.562 41.07 120.672 41.532 120.775 42.016C120.848 41.532 120.929 41.07 121.017 40.63C121.105 40.19 121.2 39.7793 121.303 39.398L127.837 17.486C127.91 17.222 128.072 16.9873 128.321 16.782C128.585 16.5767 128.9 16.474 129.267 16.474H132.589ZM141.94 25.362C143.568 25.362 145.034 25.6333 146.34 26.176C147.645 26.7187 148.76 27.4887 149.684 28.486C150.608 29.4833 151.312 30.6933 151.796 32.116C152.294 33.524 152.544 35.1007 152.544 36.846C152.544 38.606 152.294 40.19 151.796 41.598C151.312 43.006 150.608 44.2087 149.684 45.206C148.76 46.2033 147.645 46.9733 146.34 47.516C145.034 48.044 143.568 48.308 141.94 48.308C140.297 48.308 138.816 48.044 137.496 47.516C136.19 46.9733 135.076 46.2033 134.152 45.206C133.228 44.2087 132.516 43.006 132.018 41.598C131.534 40.19 131.292 38.606 131.292 36.846C131.292 35.1007 131.534 33.524 132.018 32.116C132.516 30.6933 133.228 29.4833 134.152 28.486C135.076 27.4887 136.19 26.7187 137.496 26.176C138.816 25.6333 140.297 25.362 141.94 25.362ZM141.94 45.25C144.14 45.25 145.782 44.5167 146.868 43.05C147.953 41.5687 148.496 39.508 148.496 36.868C148.496 34.2133 147.953 32.1453 146.868 30.664C145.782 29.1827 144.14 28.442 141.94 28.442C140.825 28.442 139.85 28.6327 139.014 29.014C138.192 29.3953 137.503 29.9453 136.946 30.664C136.403 31.3827 135.992 32.27 135.714 33.326C135.45 34.3673 135.318 35.548 135.318 36.868C135.318 39.508 135.86 41.5687 136.946 43.05C138.046 44.5167 139.71 45.25 141.94 45.25ZM159.908 30.18C160.612 28.6547 161.478 27.4667 162.504 26.616C163.531 25.7507 164.785 25.318 166.266 25.318C166.736 25.318 167.183 25.3693 167.608 25.472C168.048 25.5747 168.437 25.736 168.774 25.956L168.488 28.882C168.4 29.2487 168.18 29.432 167.828 29.432C167.623 29.432 167.322 29.388 166.926 29.3C166.53 29.212 166.083 29.168 165.584 29.168C164.88 29.168 164.25 29.2707 163.692 29.476C163.15 29.6813 162.658 29.9893 162.218 30.4C161.793 30.796 161.404 31.2947 161.052 31.896C160.715 32.4827 160.407 33.1573 160.128 33.92V48H156.19V25.714H158.434C158.86 25.714 159.153 25.7947 159.314 25.956C159.476 26.1173 159.586 26.396 159.644 26.792L159.908 30.18ZM174.946 15.594V48H171.03V15.594H174.946ZM194.496 31.016C193.763 30.0333 192.971 29.3513 192.12 28.97C191.269 28.574 190.316 28.376 189.26 28.376C187.192 28.376 185.601 29.1167 184.486 30.598C183.371 32.0793 182.814 34.1913 182.814 36.934C182.814 38.386 182.939 39.6327 183.188 40.674C183.437 41.7007 183.804 42.5513 184.288 43.226C184.772 43.886 185.366 44.37 186.07 44.678C186.774 44.986 187.573 45.14 188.468 45.14C189.759 45.14 190.881 44.8467 191.834 44.26C192.802 43.6733 193.689 42.8447 194.496 41.774V31.016ZM198.412 15.594V48H196.08C195.523 48 195.171 47.7287 195.024 47.186L194.672 44.48C193.719 45.624 192.633 46.548 191.416 47.252C190.199 47.956 188.791 48.308 187.192 48.308C185.916 48.308 184.757 48.066 183.716 47.582C182.675 47.0833 181.787 46.3573 181.054 45.404C180.321 44.4507 179.756 43.2627 179.36 41.84C178.964 40.4173 178.766 38.782 178.766 36.934C178.766 35.2913 178.986 33.766 179.426 32.358C179.866 30.9353 180.497 29.7033 181.318 28.662C182.139 27.6207 183.144 26.8067 184.332 26.22C185.535 25.6187 186.884 25.318 188.38 25.318C189.744 25.318 190.91 25.5527 191.878 26.022C192.861 26.4767 193.733 27.1147 194.496 27.936V15.594H198.412ZM46.6139 70.714V93H42.6979V70.714H46.6139ZM47.4499 63.718C47.4499 64.0993 47.3692 64.4587 47.2079 64.796C47.0612 65.1187 46.8559 65.412 46.5919 65.676C46.3425 65.9253 46.0419 66.1233 45.6899 66.27C45.3525 66.4167 44.9932 66.49 44.6119 66.49C44.2305 66.49 43.8712 66.4167 43.5339 66.27C43.2112 66.1233 42.9252 65.9253 42.6759 65.676C42.4265 65.412 42.2285 65.1187 42.0819 64.796C41.9352 64.4587 41.8619 64.0993 41.8619 63.718C41.8619 63.3367 41.9352 62.9773 42.0819 62.64C42.2285 62.288 42.4265 61.9873 42.6759 61.738C42.9252 61.474 43.2112 61.2687 43.5339 61.122C43.8712 60.9753 44.2305 60.902 44.6119 60.902C44.9932 60.902 45.3525 60.9753 45.6899 61.122C46.0419 61.2687 46.3425 61.474 46.5919 61.738C46.8559 61.9873 47.0612 62.288 47.2079 62.64C47.3692 62.9773 47.4499 63.3367 47.4499 63.718ZM55.4242 73.948C55.9082 73.4053 56.4215 72.914 56.9642 72.474C57.5068 72.034 58.0788 71.66 58.6802 71.352C59.2962 71.0293 59.9415 70.7873 60.6162 70.626C61.3055 70.45 62.0462 70.362 62.8382 70.362C64.0555 70.362 65.1262 70.5673 66.0502 70.978C66.9888 71.374 67.7662 71.946 68.3822 72.694C69.0128 73.4273 69.4895 74.3147 69.8122 75.356C70.1348 76.3973 70.2962 77.5487 70.2962 78.81V93H66.3582V78.81C66.3582 77.1233 65.9695 75.818 65.1922 74.894C64.4295 73.9553 63.2635 73.486 61.6942 73.486C60.5355 73.486 59.4502 73.7647 58.4382 74.322C57.4408 74.8793 56.5168 75.6347 55.6662 76.588V93H51.7282V70.714H54.0822C54.6395 70.714 54.9842 70.9853 55.1162 71.528L55.4242 73.948ZM113.129 77.248C113.129 79.6093 112.755 81.758 112.007 83.694C111.259 85.63 110.203 87.2873 108.839 88.666C107.475 90.0447 105.832 91.1153 103.911 91.878C102.004 92.626 99.8925 93 97.5751 93H85.8051V61.474H97.5751C99.8925 61.474 102.004 61.8553 103.911 62.618C105.832 63.366 107.475 64.4367 108.839 65.83C110.203 67.2087 111.259 68.866 112.007 70.802C112.755 72.738 113.129 74.8867 113.129 77.248ZM108.751 77.248C108.751 75.312 108.487 73.5813 107.959 72.056C107.431 70.5307 106.683 69.24 105.715 68.184C104.747 67.128 103.574 66.3213 102.195 65.764C100.816 65.2067 99.2765 64.928 97.5751 64.928H90.0731V89.546H97.5751C99.2765 89.546 100.816 89.2673 102.195 88.71C103.574 88.1527 104.747 87.3533 105.715 86.312C106.683 85.256 107.431 83.9653 107.959 82.44C108.487 80.9147 108.751 79.184 108.751 77.248ZM128.553 82.968C126.749 83.0267 125.209 83.1733 123.933 83.408C122.672 83.628 121.638 83.9213 120.831 84.288C120.039 84.6547 119.46 85.0873 119.093 85.586C118.741 86.0847 118.565 86.642 118.565 87.258C118.565 87.8447 118.661 88.3507 118.851 88.776C119.042 89.2013 119.299 89.5533 119.621 89.832C119.959 90.096 120.347 90.294 120.787 90.426C121.242 90.5433 121.726 90.602 122.239 90.602C122.929 90.602 123.559 90.536 124.131 90.404C124.703 90.2573 125.239 90.052 125.737 89.788C126.251 89.524 126.735 89.2087 127.189 88.842C127.659 88.4753 128.113 88.0573 128.553 87.588V82.968ZM115.903 73.86C117.135 72.672 118.463 71.7847 119.885 71.198C121.308 70.6113 122.885 70.318 124.615 70.318C125.862 70.318 126.969 70.5233 127.937 70.934C128.905 71.3447 129.719 71.9167 130.379 72.65C131.039 73.3833 131.538 74.2707 131.875 75.312C132.213 76.3533 132.381 77.4973 132.381 78.744V93H130.643C130.262 93 129.969 92.9413 129.763 92.824C129.558 92.692 129.397 92.4427 129.279 92.076L128.839 89.964C128.253 90.5067 127.681 90.9907 127.123 91.416C126.566 91.8267 125.979 92.1787 125.363 92.472C124.747 92.7507 124.087 92.9633 123.383 93.11C122.694 93.2713 121.924 93.352 121.073 93.352C120.208 93.352 119.394 93.2347 118.631 93C117.869 92.7507 117.201 92.384 116.629 91.9C116.072 91.416 115.625 90.8073 115.287 90.074C114.965 89.326 114.803 88.446 114.803 87.434C114.803 86.554 115.045 85.7107 115.529 84.904C116.013 84.0827 116.798 83.3567 117.883 82.726C118.969 82.0953 120.384 81.582 122.129 81.186C123.875 80.7753 126.016 80.5407 128.553 80.482V78.744C128.553 77.0133 128.179 75.708 127.431 74.828C126.683 73.9333 125.591 73.486 124.153 73.486C123.185 73.486 122.371 73.6107 121.711 73.86C121.066 74.0947 120.501 74.366 120.017 74.674C119.548 74.9673 119.137 75.2387 118.785 75.488C118.448 75.7227 118.111 75.84 117.773 75.84C117.509 75.84 117.282 75.774 117.091 75.642C116.901 75.4953 116.739 75.3193 116.607 75.114L115.903 73.86ZM143.568 93.352C141.808 93.352 140.451 92.8607 139.498 91.878C138.559 90.8953 138.09 89.48 138.09 87.632V73.992H135.406C135.171 73.992 134.973 73.926 134.812 73.794C134.65 73.6473 134.57 73.4273 134.57 73.134V71.572L138.222 71.11L139.124 64.224C139.168 64.004 139.263 63.828 139.41 63.696C139.571 63.5493 139.776 63.476 140.026 63.476H142.006V71.154H148.452V73.992H142.006V87.368C142.006 88.3067 142.233 89.0033 142.688 89.458C143.142 89.9127 143.729 90.14 144.448 90.14C144.858 90.14 145.21 90.0887 145.504 89.986C145.812 89.8687 146.076 89.744 146.296 89.612C146.516 89.48 146.699 89.3627 146.846 89.26C147.007 89.1427 147.146 89.084 147.264 89.084C147.469 89.084 147.652 89.2087 147.814 89.458L148.958 91.328C148.283 91.9587 147.469 92.4573 146.516 92.824C145.562 93.176 144.58 93.352 143.568 93.352ZM163.253 82.968C161.449 83.0267 159.909 83.1733 158.633 83.408C157.372 83.628 156.338 83.9213 155.531 84.288C154.739 84.6547 154.16 85.0873 153.793 85.586C153.441 86.0847 153.265 86.642 153.265 87.258C153.265 87.8447 153.36 88.3507 153.551 88.776C153.742 89.2013 153.998 89.5533 154.321 89.832C154.658 90.096 155.047 90.294 155.487 90.426C155.942 90.5433 156.426 90.602 156.939 90.602C157.628 90.602 158.259 90.536 158.831 90.404C159.403 90.2573 159.938 90.052 160.437 89.788C160.95 89.524 161.434 89.2087 161.889 88.842C162.358 88.4753 162.813 88.0573 163.253 87.588V82.968ZM150.603 73.86C151.835 72.672 153.162 71.7847 154.585 71.198C156.008 70.6113 157.584 70.318 159.315 70.318C160.562 70.318 161.669 70.5233 162.637 70.934C163.605 71.3447 164.419 71.9167 165.079 72.65C165.739 73.3833 166.238 74.2707 166.575 75.312C166.912 76.3533 167.081 77.4973 167.081 78.744V93H165.343C164.962 93 164.668 92.9413 164.463 92.824C164.258 92.692 164.096 92.4427 163.979 92.076L163.539 89.964C162.952 90.5067 162.38 90.9907 161.823 91.416C161.266 91.8267 160.679 92.1787 160.063 92.472C159.447 92.7507 158.787 92.9633 158.083 93.11C157.394 93.2713 156.624 93.352 155.773 93.352C154.908 93.352 154.094 93.2347 153.331 93C152.568 92.7507 151.901 92.384 151.329 91.9C150.772 91.416 150.324 90.8073 149.987 90.074C149.664 89.326 149.503 88.446 149.503 87.434C149.503 86.554 149.745 85.7107 150.229 84.904C150.713 84.0827 151.498 83.3567 152.583 82.726C153.668 82.0953 155.084 81.582 156.829 81.186C158.574 80.7753 160.716 80.5407 163.253 80.482V78.744C163.253 77.0133 162.879 75.708 162.131 74.828C161.383 73.9333 160.29 73.486 158.853 73.486C157.885 73.486 157.071 73.6107 156.411 73.86C155.766 74.0947 155.201 74.366 154.717 74.674C154.248 74.9673 153.837 75.2387 153.485 75.488C153.148 75.7227 152.81 75.84 152.473 75.84C152.209 75.84 151.982 75.774 151.791 75.642C151.6 75.4953 151.439 75.3193 151.307 75.114L150.603 73.86Z" fill="white"/>
            <rect y="106.789" width="210" height="13.211" fill="#D42B21"/>
        </g>
        <defs>
            <clipPath id="clip0">
                <rect width="210" height="120" fill="white"/>
            </clipPath>
        </defs>
    </a>
</svg>`

class Logo {
    props: LogoProps
    constructor(props: LogoProps) {
        this.props = props
    }

    @computed get targetHeight() {
        return 35
    }

    @computed get origWidth() { return 211 }
    @computed get origHeight() { return 130 }

    @computed get scale(): number {
        return this.origHeight === 0 ? 1 : this.targetHeight / this.origHeight
    }

    @computed get width() { return this.origWidth * this.scale }
    @computed get height() { return this.origHeight * this.scale }

    render(targetX: number, targetY: number) {
        const { props, scale } = this
        const svg = (props.svg.match(/<svg>(.*)<\/svg>/) || "")[1] || props.svg
        return <g opacity={0.8} transform={`translate(${Math.round(targetX)}, ${targetY}) scale(${parseFloat(scale.toFixed(2))})`} dangerouslySetInnerHTML={{ __html: svg }} />
    }
}

interface HeaderProps {
    maxWidth: number,
    chart: ChartConfig
}

export class Header {
    props: HeaderProps

    constructor(props: HeaderProps) {
        this.props = props
    }

    @computed get titleText() {
        return this.props.chart.data.currentTitle
    }

    @computed get subtitleText() {
        return this.props.chart.subtitle
    }

    @computed get logo(): Logo|undefined {
        return this.props.chart.props.hideLogo ? undefined : new Logo({ fontSize: this.props.chart.baseFontSize, svg: LOGO_SVG })
    }

    @computed get logoWidth(): number { return this.logo ? this.logo.width : 0 }
    @computed get logoHeight(): number { return this.logo ? this.logo.height : 0 }

    @computed get title() {
        const { props, logoWidth } = this
        let { titleText } = this

        const maxWidth = props.maxWidth - logoWidth - 15
        // HACK (Mispy): Stop the title jumping around during timeline transitions
        if (props.chart.data.minYear === props.chart.data.maxYear && props.chart.data.isShowingTimeline) {
            titleText = titleText + " in 2000"
        }

        // Try to fit the title into a single line if possible-- but not if it would make the text super small
        let title: TextWrap
        let fontScale = 1.4
        while (true) {
            title = new TextWrap({ maxWidth: maxWidth, fontSize: fontScale*props.chart.baseFontSize, text: titleText, lineHeight: 1 })
            if (fontScale <= 1.2 || title.lines.length <= 1)
                break
            fontScale -= 0.05
        }

        return new TextWrap({ maxWidth: maxWidth, fontSize: fontScale*props.chart.baseFontSize, text: this.titleText, lineHeight: 1 })
    }

    @computed get subtitleWidth() {
        // If the subtitle is entirely below the logo, we can go underneath it
        return this.title.height > this.logoHeight ? this.props.maxWidth : this.props.maxWidth - this.logoWidth - 10
    }

    @computed get subtitle() {
        const that = this
        return new TextWrap({
            get maxWidth() { return that.subtitleWidth },
            get fontSize() { return 0.8*that.props.chart.baseFontSize },
            get text() { return that.subtitleText }
        })
    }

    @computed get height() {
        if (this.props.chart.isMediaCard)
            return 0
        else
            return Math.max(this.title.height + this.subtitle.height + 2, this.logoHeight)
    }

    render(x: number, y: number) {
        return <HeaderView x={x} y={y} header={this}/>
    }
}

@observer
class HeaderView extends React.Component<{ x: number, y: number, header: Header }> {
    render() {
        const { props } = this
        const { title, titleText, logo, subtitle } = props.header
        const { chart, maxWidth } = props.header.props

        if (chart.isSinglePage)
            document.title = titleText

        if (chart.isMediaCard)
            return null

        return <g className="HeaderView">
            {logo && logo.height > 0 && logo.render(props.x + maxWidth - logo.width, props.y)}
            <a href={chart.url.canonicalUrl} target="_blank">
                {title.render(props.x, props.y, { fill: "#555" })}
            </a>
            {subtitle.render(props.x, props.y + title.height + 2, { fill: "#666" })}
        </g>
    }
}
