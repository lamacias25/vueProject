-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2023 at 01:55 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exampledb`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_users` int(11) NOT NULL,
  `nombre` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `paterno` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `materno` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `domicilio` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `correo` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `createdAt` text COLLATE utf8mb4_spanish_ci NOT NULL,
  `updatedAt` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_users`, `nombre`, `paterno`, `materno`, `domicilio`, `correo`, `createdAt`, `updatedAt`) VALUES
(4, 'Cristian Jesus erd', 'Garcia', 'Uribeertge', 'Casino Tepeyac', 'cris@rgtrf.rfr', '', '0000-00-00'),
(10, 'yht', 'et', 'ete', 'ete', 'dfd@esd.21', '2023-10-17 23:18:02', '2023-10-17'),
(11, 'Leslie', 'Guillen', 'Medina', 'Tepeyac', 'lesli@hotmail.com', '2023-10-18 00:08:08', '2023-10-18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_users`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
