#O que?
Um app todolist simples e básico, criado enquanto participei do Chrome Apps Hackathon em São Paulo, Brasil.

#Como?
Utilizando javascript e a API storage do chrome, desenvolvi um app para adicionar e remover de forma dinâmica conteúdo da página (no exemplo, uma todolist).
Os dados adicionados ainda são armazenados e sincronizados com a conta do Google do usuário.

#Limite da API
- armazenamento total de 102.400 bytes, no estilo JSON, { key : value }
- 4.906 bytes para cada item adicionado ao sync
- 512 é a quantidade máxima de items que podem ser armazenados no sync 
- 1.000 é o máximo de operações por hora (set, remove, clear, get, etc...) que podem ser feitas
- 10 é o máximo de operações por MINUTO (oh god), que podem ser feitas
