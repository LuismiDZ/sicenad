package es.mde.repositorios;

import java.util.List;
import es.mde.entidades.Categoria;
import es.mde.entidades.Cenad;
import es.mde.entidades.Recurso;
import es.mde.entidades.SolicitudRecurso;

/**
 * Representa la interfaz con los metodos personalizados de CENAD,s
 * @author JOSE LUIS PUENTES ÁLAMOS - MIGUEL PRADA MUÑOZ
 *
 */
public interface CenadDAOCustom {
	/**
	 * Devuelve una lista de las categorias padre de un CENAD
	 * @param id Id del CENAD
	 * @return Devuelve una lista de las categorias padre de un CENAD
	 */
	List<Categoria> getCategoriasPadreCenad(Long id);
	/**
	 * Devuelve una lista de los recursos de un CENAD
	 * @param id Id del CENAD
	 * @return Devuelve una lista de los recursos de un CENAD
	 */
	List<Recurso> getRecursosCenad(Long id);
	/**
	 * Devuelve una lista de las solicitudes de un CENAD
	 * @param id Id del CENAD
	 * @return Devuelve una lista de las solicitudes de un CENAD
	 */
	List<SolicitudRecurso> getSolicitudesCenad(Long id);
	/**
	 * Devuelve una lista de los CENAD sin administrador
	 * @return Devuelve una lista de los CENAD sin administrador
	 */
	List<Cenad> getCenadsSinAdmin();
}