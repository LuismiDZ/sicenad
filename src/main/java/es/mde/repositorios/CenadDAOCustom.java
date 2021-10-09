package es.mde.repositorios;

import java.util.List;

import es.mde.entidades.Categoria;
import es.mde.entidades.Recurso;
import es.mde.entidades.UsuarioGestor;


public interface CenadDAOCustom {

	List<Categoria> getCategoriasCenad(Long id);
	List<Categoria> getCategoriasPadreCenad(Long id);
	List<Recurso> getRecursosCenad(Long id);
	List<UsuarioGestor> getUsuariosGestorCenad(Long id);


}
