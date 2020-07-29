/*
 Script pasaje de Oracle a SQLServer
 */


ALTER TABLE ESCALUC1
ADD AluAgeTieneHoras bit;

ALTER TABLE ESCALUCU
ADD EscAluCurFiltro varchar(8000) COLLATE Modern_Spanish_CI_AS  NULL,
  EscAluCurSede varchar(40) COLLATE Modern_Spanish_CI_AS  NULL,
  EscAluCurRecogerEnDomicilio bit  NULL,
  EscAluCurCondicionesCurso bit  NULL,
  EscAluCurReglamentoEscuela bit  NULL,
  EscAluCurDocumentosEntregados bit  NULL,
  EscAluCurELearning bit  NULL;

ALTER TABLE ESCALUMN
ADD AluFiltro varchar(8000);


ALTER TABLE ESCINSTR
ADD EscMovCod int  NULL;

ALTER TABLE ESCTIPCU
ADD TipCurClaseAdicional bit  NULL;

ALTER TABLE FACTURA
ADD FacPendiente bit  NULL;


ALTER TABLE SOCIOS
ADD SocFiltro varchar(8000);


-- Agrego Primary Key

ALTER TABLE ESCCTACT
ADD PRIMARY KEY (ALUID, TIPCURID, ESCALUCURI, CTACTEMOVI);



-- Cambio los valores
UPDATE ESCALUC1
set AluAgeDia = 'SÁB'
where AluAgeDia = 'S¿B';

UPDATE ESCALUC1
set AluAgeDia = 'MIÉ'
where AluAgeDia = 'MI¿';

UPDATE EscAluCur2
set AluAgeDia = 'SÁB'
where AluAgeDia = 'S¿B';

UPDATE EscAluCur2
set AluAgeDia = 'MIÉ'
where AluAgeDia = 'MI¿';

update ESCVEH1 set ESCVEHFCHH = NULL  where ESCVEHFCHH < '1999-01-01'