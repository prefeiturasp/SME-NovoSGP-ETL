select turma_id, etapa_eja from turma where modalidade_codigo = 3 and ano_letivo < date_part('year', now()) and turma_id in () order by turma_id