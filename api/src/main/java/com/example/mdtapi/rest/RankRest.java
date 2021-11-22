package com.example.mdtapi.rest;

import com.example.mdtapi.models.Department;
import com.example.mdtapi.models.Rank;
import com.example.mdtapi.repositories.DepartmentRepository;
import com.example.mdtapi.repositories.RankRepository;
import com.example.mdtapi.utils.InsertRankBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
public class RankRest {

    @Autowired
    private final RankRepository rankRepository;

    @Autowired
    private final DepartmentRepository departmentRepository;

    public RankRest(RankRepository rankRepository, DepartmentRepository departmentRepository) {
        this.rankRepository = rankRepository;
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/ranks")
    public List<Rank> all() {
        return rankRepository.findAll();
    }

    @PostMapping("/rank")
    public void insert(@RequestBody InsertRankBody rank) {
        System.out.println(rank);
        Department department = departmentRepository.findByCode(rank.getDepartmentCode());
        if (department == null)
            return;

        Rank newRank = new Rank(rank.getTitle(), rank.getSalary(), department);
        rankRepository.save(newRank);
    }
}
