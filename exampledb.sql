-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2023 at 02:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
  `nombre` text NOT NULL,
  `paterno` text NOT NULL,
  `materno` text NOT NULL,
  `domicilio` text NOT NULL,
  `correo` text NOT NULL,
  `createdAt` text NOT NULL,
  `updatedAt` date NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_users`, `nombre`, `paterno`, `materno`, `domicilio`, `correo`, `createdAt`, `updatedAt`, `stock`) VALUES
(10, 'yht', 'et', 'ete', 'ete', 'dfd@esd.21', '2023-10-17 23:18:02', '2023-10-17', 2),
(11, 'Leslie', 'Guillen', 'Medina', 'Tepeyac', 'lesli@hotmail.com', '2023-10-18 00:08:08', '2023-10-18', 0),
(12, 'aaaaaaaaaa', 'aaaaaaaaa', 'aaaaaaa', 'aaaaaa', 'uhjkh@kjkln.dfgd', '2023-11-22 13:27:43', '2023-11-22', 0),
(14, 'hjvhjb', '', 'hjbhjbhj', '', '', '2023-11-23 12:55:47', '2023-11-23', 567);

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
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
