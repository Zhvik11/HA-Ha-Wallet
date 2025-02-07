console.log("🔄 wallet.js загружен!");

// ✅ Web3Auth Client ID
const WEB3AUTH_CLIENT_ID = "BDOYHg_xx3KgooZc5JTdAqlIklnnYnkXL8RYAT0OfmMaEVKbEDKgb5X33RBNulq1iOeT7szmQXZIrdu33G7rjMY";

// ✅ Infura RPC URL
const INFURA_RPC_URL = "https://mainnet.infura.io/v3/b8e6aa3efaf84f238c7c886b31f00ee6";

// ✅ Глобальные переменные
let web3auth;
let ethersProvider;

// ✅ Проверяем, загружен ли Web3Auth
if (!window.Web3Auth) {
    console.error("❌ Web3Auth не загружен! Проверь подключение в index.html.");
}

// ✅ Инициализация Web3Auth
async function initWeb3Auth() {
    try {
        web3auth = new window.Web3Auth.Modal({
            clientId: WEB3AUTH_CLIENT_ID,
            chainConfig: {
                chainNamespace: "eip155",
                chainId: "0x1",
                rpcTarget: INFURA_RPC_URL // 🔥 Используем Infura
            }
        });

        await web3auth.initModal();
        console.log("✅ Web3Auth инициализирован!");
    } catch (error) {
        console.error("❌ Ошибка инициализации Web3Auth:", error);
    }
}

// ✅ Вход через Web3Auth
async function loginWithWeb3Auth() {
    if (!web3auth) {
        console.error("❌ Web3Auth не инициализирован!");
        return;
    }

    try {
        const provider = await web3auth.connect();
        console.log("✅ Вход выполнен через Web3Auth!", provider);

        ethersProvider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();

        document.getElementById("walletAddress").innerText = `Кошелек: ${address}`;
        getBalance(address);
        
        showScreen('walletScreen'); // ✅ Переключаемся на экран кошелька после входа
    } catch (error) {
        console.error("❌ Ошибка входа через Web3Auth:", error);
    }
}

// ✅ Подключение MetaMask
async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask не установлен! Установи его: https://metamask.io/");
        return;
    }

    try {
        ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await ethersProvider.send("eth_requestAccounts", []);
        const signer = ethersProvider.getSigner();
        const address = await signer.getAddress();

        console.log("✅ Подключен MetaMask аккаунт:", address);
        document.getElementById("walletAddress").innerText = `Кошелек: ${address}`;

        getBalance(address);
        
        showScreen('walletScreen'); // ✅ После подключения MetaMask переходим в кошелек
    } catch (error) {
        console.error("❌ Ошибка подключения MetaMask:", error);
    }
}

// ✅ Получение баланса ETH
async function getBalance(address) {
    if (!ethersProvider) {
        console.error("❌ Провайдер не подключен!");
        return;
    }

    try {
        const balance = await ethersProvider.getBalance(address);
        const balanceInEth = ethers.utils.formatEther(balance);
        console.log(`💰 Баланс: ${balanceInEth} ETH`);
        document.getElementById("walletBalance").innerText = `Баланс: ${balanceInEth} ETH`;
    } catch (error) {
        console.error("❌ Ошибка получения баланса:", error);
    }
}

// ✅ Переключение экранов
function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.style.display = "none";
    });

    document.getElementById(screenId).style.display = "block";
}

// ✅ Привязываем кнопки из SVG
function bindSvgButtons() {
    setTimeout(() => {
        const loginButton = document.getElementById("loginButton");
        const walletButton = document.getElementById("walletButton");
        const eventButton = document.getElementById("eventButton");

        if (loginButton) {
            loginButton.addEventListener("click", () => {
                console.log("🔑 Нажата кнопка входа");
                loginWithWeb3Auth();
            });
        } else {
            console.error("❌ Кнопка входа не найдена в SVG!");
        }

        if (walletButton) {
            walletButton.addEventListener("click", () => {
                console.log("💰 Нажата кнопка кошелька");
                connectWallet();
            });
        } else {
            console.error("❌ Кнопка кошелька не найдена в SVG!");
        }

        if (eventButton) {
            eventButton.addEventListener("click", () => {
                console.log("📅 Нажата кнопка создания события");
                showScreen('eventScreen');
            });
        } else {
            console.error("❌ Кнопка создания события не найдена в SVG!");
        }
    }, 1000);
}

// ✅ Привязываем функции к кнопкам после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {
    bindSvgButtons();

    const web3AuthButton = document.getElementById("web3AuthButton");
    const connectButton = document.getElementById("connectButton");

    if (web3AuthButton) {
        web3AuthButton.addEventListener("click", loginWithWeb3Auth);
    } else {
        console.error("❌ Кнопка Web3Auth не найдена!");
    }

    if (connectButton) {
        connectButton.addEventListener("click", connectWallet);
    } else {
        console.error("❌ Кнопка подключения MetaMask не найдена!");
    }

    // ✅ Запускаем Web3Auth
    initWeb3Auth();
});






