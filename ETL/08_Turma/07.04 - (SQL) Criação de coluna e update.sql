﻿USE [Manutencao]

ALTER TABLE ETL_TURMAS_ANO 
ADD id int  NULL;

update ETL_TURMAS_ANO
set ETL_TURMAS_ANO.id = NULL
