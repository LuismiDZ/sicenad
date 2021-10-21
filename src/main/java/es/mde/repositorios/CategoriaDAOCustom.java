package es.mde.repositorios;

import java.util.List;
import es.mde.entidades.Categoria;
import es.mde.entidades.Recurso;

public interface CategoriaDAOCustom {
	List<Categoria> getSubcategoriasAnidadas(Long id);
	List<Categoria> getCategoriasPadre();
	List<Recurso> getRecursosDeSubcategorias(Long id);
}