-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : lun. 27 oct. 2025 à 17:54
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bomareco_facilite`
--

-- --------------------------------------------------------

--
-- Structure de la table `financing`
--

CREATE TABLE `financing` (
  `id` int(11) NOT NULL,
  `reference` varchar(50) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_phone` varchar(20) NOT NULL,
  `client_email` varchar(255) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `address` text NOT NULL,
  `wilaya` varchar(100) NOT NULL,
  `marital_status` enum('single','married','divorced','widowed') NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `client_salary` decimal(10,2) NOT NULL,
  `spouse_salary` decimal(10,2) DEFAULT 0.00,
  `total_salary` decimal(10,2) NOT NULL,
  `duration` int(11) NOT NULL,
  `employment_type` enum('public','private','retired') NOT NULL,
  `other_financing` decimal(10,2) DEFAULT 0.00,
  `monthly_payment` decimal(10,2) NOT NULL,
  `total_payment` decimal(10,2) NOT NULL,
  `payment_ratio` decimal(5,2) NOT NULL,
  `is_eligible` tinyint(1) NOT NULL,
  `status` enum('pending','processing','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `admin_validated` tinyint(1) DEFAULT 0,
  `bank_validated` tinyint(1) DEFAULT 0,
  `admin_validated_at` timestamp NULL DEFAULT NULL,
  `bank_validated_at` timestamp NULL DEFAULT NULL,
  `admin_validator_id` int(11) DEFAULT NULL,
  `bank_validator_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `financing`
--

INSERT INTO `financing` (`id`, `reference`, `client_name`, `client_phone`, `client_email`, `birth_date`, `address`, `wilaya`, `marital_status`, `product_id`, `product_name`, `product_price`, `client_salary`, `spouse_salary`, `total_salary`, `duration`, `employment_type`, `other_financing`, `monthly_payment`, `total_payment`, `payment_ratio`, `is_eligible`, `status`, `created_at`, `updated_at`, `admin_validated`, `bank_validated`, `admin_validated_at`, `bank_validated_at`, `admin_validator_id`, `bank_validator_id`) VALUES
(1, 'FIN-2025-001', 'bourouba ilyes', '0698095449', 'ilyes.bourouba7@gmail.com', '1993-10-26', 'zeralda', 'Alger', 'single', 1, 'TV 55\\', 143640.00, 200000.00, 0.00, 200000.00, 24, 'public', 0.00, 6562.00, 157492.00, 3.30, 1, 'rejected', '2025-10-26 09:59:26', '2025-10-26 15:01:46', 0, 0, NULL, NULL, NULL, NULL),
(2, 'FIN-2025-002', 'zeffouni moh', '0551316015', 'ilyes.bourouba7@gmail.com', '1995-02-10', 'blida', 'Oran', 'married', 1, 'TV 55\\', 143640.00, 3000000.00, 0.00, 3000000.00, 36, 'private', 0.00, 4568.00, 164438.00, 0.20, 1, 'approved', '2025-10-26 10:20:57', '2025-10-26 15:02:20', 1, 1, '2025-10-26 15:01:33', '2025-10-26 15:02:20', 2, 3);

-- --------------------------------------------------------

--
-- Structure de la table `financing_documents`
--

CREATE TABLE `financing_documents` (
  `id` int(11) NOT NULL,
  `financing_id` int(11) NOT NULL,
  `document_type` enum('cni','payslip','work_certificate','other') NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `financing_documents`
--

INSERT INTO `financing_documents` (`id`, `financing_id`, `document_type`, `file_name`, `file_path`, `uploaded_at`) VALUES
(1, 1, 'cni', 'Screenshot 2025-10-23 at 08.30.46.png', 'documents/DOC_1761472746914_cni.png', '2025-10-26 09:59:26'),
(2, 1, 'payslip', 'Screenshot 2025-10-21 at 15.47.16.png', 'documents/DOC_1761472756542_payslips.png', '2025-10-26 09:59:26'),
(3, 1, 'work_certificate', 'Screenshot 2025-10-21 at 11.00.42.png', 'documents/DOC_1761472766042_work_certificate.png', '2025-10-26 09:59:26'),
(4, 2, 'cni', 'Screenshot 2025-10-21 at 10.45.46.png', 'documents/DOC_1761473993819_cni.png', '2025-10-26 10:20:57'),
(5, 2, 'payslip', 'Simulator Screenshot - iPhone 16 Pro Max - 2025-10-21 at 14.46.10.png', 'documents/DOC_1761474049087_payslips.png', '2025-10-26 10:20:57'),
(6, 2, 'work_certificate', 'Screenshot 2025-10-23 at 08.22.49.png', 'documents/DOC_1761474056989_work_certificate.png', '2025-10-26 10:20:57');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `monthly_price_36` decimal(10,2) DEFAULT NULL,
  `specifications` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `monthly_price_36`, `specifications`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'TV 55\" UHD 4K Google TV--ilyes', 'Frameless, Mini LED 144Hz', 143640.00, 3990.00, '55 pouces, UHD 4K, Mini LED, 144Hz, Google TV', 1, '2025-10-26 11:54:48', '2025-10-26 12:17:55'),
(2, 'TV 65\" UHD 4K Google TV', 'Frameless, Mini LED 60Hz', 179640.00, 4990.00, '65 pouces, UHD 4K, Mini LED, 60Hz, Google TV', 1, '2025-10-26 11:54:48', '2025-10-26 11:54:48'),
(3, 'TV 70\" UHD 4K Google TV', 'Frameless, Built-in Demo', 251640.00, 6990.00, '70 pouces, UHD 4K, Frameless, Google TV', 1, '2025-10-26 11:54:48', '2025-10-26 11:54:48'),
(4, 'TV 85\" UHD 4K Google TV', 'Frameless, Mini LED 144Hz', 431640.00, 11990.00, '85 pouces, UHD 4K, Mini LED, 144Hz, Google TV', 1, '2025-10-26 11:54:48', '2025-10-26 11:54:48');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','bank') NOT NULL DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Ahmed Benali', 'ahmed@example.com', '0551316015', '$2a$12$pmbzrxSub3.Rir9LcJjbyeKBq7QhFJK15S3tCnURF74/i70Zl73K6', 'user', 1, '2025-10-26 13:45:01', '2025-10-26 14:25:45'),
(2, 'Admin User', 'admin@stream.dz', '0770000000', '$2a$12$pmbzrxSub3.Rir9LcJjbyeKBq7QhFJK15S3tCnURF74/i70Zl73K6', 'admin', 1, '2025-10-26 13:45:01', '2025-10-26 14:25:50'),
(3, 'Bank Manager', 'bank@alsalam.dz', '0660000000', '$2a$12$pmbzrxSub3.Rir9LcJjbyeKBq7QhFJK15S3tCnURF74/i70Zl73K6', 'bank', 1, '2025-10-26 13:45:01', '2025-10-26 14:25:54'),
(4, 'bourouba ilyes', 'ilyes.bourouba7@gmail.com', '0698095449', '$2b$10$90jB9RmcZ0Z8G6ZSuroLjO908aVe1GDV1L8Dlh0AfEMpmWstsgG5O', 'user', 1, '2025-10-26 15:04:19', '2025-10-26 15:04:19');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `financing`
--
ALTER TABLE `financing`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `idx_reference` (`reference`),
  ADD KEY `idx_client_phone` (`client_phone`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Index pour la table `financing_documents`
--
ALTER TABLE `financing_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `financing_id` (`financing_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_is_active` (`is_active`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_phone` (`phone`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `financing`
--
ALTER TABLE `financing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `financing_documents`
--
ALTER TABLE `financing_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `financing_documents`
--
ALTER TABLE `financing_documents`
  ADD CONSTRAINT `financing_documents_ibfk_1` FOREIGN KEY (`financing_id`) REFERENCES `financing` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
