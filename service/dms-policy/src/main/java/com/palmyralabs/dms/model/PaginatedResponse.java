
package com.palmyralabs.dms.model;

import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Data
@RequiredArgsConstructor
@Getter
@Setter
public class PaginatedResponse<T> {

    private final List<T> result;
    private final int limit;
    private final int offset;
    private final long total;

}
