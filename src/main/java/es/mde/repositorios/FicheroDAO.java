package es.mde.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import es.mde.entidades.Fichero;

@RepositoryRestResource(path="ficheros", collectionResourceRel="ficheros", itemResourceRel="fichero") 
public interface FicheroDAO extends JpaRepository<Fichero, Long> {

	@RestResource(path="nombre")
	List<Fichero> findByNombreIgnoreCaseContaining(@Param("nombre") String txt);
}