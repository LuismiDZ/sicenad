package es.mde.repositorios;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import es.mde.entidades.Cartografia;


@RepositoryRestResource(path="cartografias", collectionResourceRel="cartografias", itemResourceRel="cartografia") 
public interface CartografiaDAO extends JpaRepository<Cartografia, Long> {

	@RestResource(path="nombre")
	List<Cartografia> findByNombreIgnoreCaseContaining(@Param("nombre") String txt);
}
